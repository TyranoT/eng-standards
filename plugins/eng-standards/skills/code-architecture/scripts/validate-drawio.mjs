#!/usr/bin/env node
/**
 * Valida arquivos .drawio (XML descomprimido) antes de entregar um diagrama.
 *
 * Uso: node validate-drawio.mjs <arquivo.drawio> [outro.drawio ...]
 * Sai com código 1 quando encontra erro; avisos não bloqueiam.
 */
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const TAG_PATTERN = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<(\/?)([A-Za-z][\w:.-]*)((?:\s+[\w:.-]+\s*=\s*"[^"]*")*)\s*(\/?)>/g;
const ATTRIBUTE_PATTERN = /([\w:.-]+)\s*=\s*"([^"]*)"/g;
const UNESCAPED_AMPERSAND = /&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/;
const WRAPPER_TAGS = new Set(['UserObject', 'object']);
const MAX_VERTICES_PER_PAGE = 30;

/**
 * Converte a lista de atributos crua de uma tag em objeto.
 *
 * @param rawAttributes - Trecho da tag após o nome, ex.: ` id="a" vertex="1"`
 * @returns Mapa atributo → valor, ainda com as entidades XML
 */
function parseAttributes(rawAttributes) {
  const attributes = {};
  for (const [, name, value] of rawAttributes.matchAll(ATTRIBUTE_PATTERN)) {
    attributes[name] = value;
  }
  return attributes;
}

function lineAt(text, index) {
  return text.slice(0, index).split('\n').length;
}

/**
 * Quebra o XML em tags, reportando trechos que não formam tag válida.
 *
 * @returns Tags na ordem do arquivo e erros de sintaxe encontrados
 */
function tokenize(xml) {
  const tags = [];
  const errors = [];
  let previousEnd = 0;

  for (const match of xml.matchAll(TAG_PATTERN)) {
    const textBetween = xml.slice(previousEnd, match.index);
    if (textBetween.includes('<')) {
      errors.push(`linha ${lineAt(xml, previousEnd + textBetween.indexOf('<'))}: tag malformada (aspas faltando ou "<" solto)`);
    }
    previousEnd = match.index + match[0].length;

    const [, closingSlash, name, rawAttributes, selfClosingSlash] = match;
    if (!name) continue;

    tags.push({
      name,
      closing: closingSlash === '/',
      selfClosing: selfClosingSlash === '/',
      attributes: parseAttributes(rawAttributes ?? ''),
      line: lineAt(xml, match.index),
    });
  }

  if (xml.slice(previousEnd).includes('<')) {
    errors.push(`linha ${lineAt(xml, previousEnd)}: tag malformada no fim do arquivo`);
  }
  return { tags, errors };
}

function checkTagBalance(tags) {
  const errors = [];
  const openTags = [];

  for (const tag of tags) {
    if (tag.selfClosing) continue;
    if (!tag.closing) {
      openTags.push(tag);
      continue;
    }
    const lastOpen = openTags.pop();
    if (!lastOpen || lastOpen.name !== tag.name) {
      errors.push(`linha ${tag.line}: </${tag.name}> fecha ${lastOpen ? `<${lastOpen.name}> da linha ${lastOpen.line}` : 'nada'}`);
      return errors;
    }
  }
  for (const unclosed of openTags) {
    errors.push(`linha ${unclosed.line}: <${unclosed.name}> nunca foi fechada`);
  }
  return errors;
}

function checkAttributeEscaping(tags) {
  const errors = [];
  for (const tag of tags) {
    for (const [name, value] of Object.entries(tag.attributes)) {
      if (value.includes('<')) errors.push(`linha ${tag.line}: "<" cru em ${name}= — use &lt;`);
      if (UNESCAPED_AMPERSAND.test(value)) errors.push(`linha ${tag.line}: "&" sem escape em ${name}= — use &amp;`);
    }
  }
  return errors;
}

/**
 * Agrupa as células mxCell por página (<diagram>), anexando geometria e pontos soltos.
 */
function collectDiagrams(tags) {
  const diagrams = [];
  let currentDiagram = null;
  let currentCell = null;
  let wrapperAttributes = null;

  for (const tag of tags) {
    if (tag.name === 'diagram' && !tag.closing) {
      currentDiagram = { name: tag.attributes.name ?? '(sem nome)', hasModel: false, cells: [] };
      diagrams.push(currentDiagram);
      continue;
    }
    if (!currentDiagram) continue;

    if (tag.name === 'mxGraphModel' && !tag.closing) currentDiagram.hasModel = true;

    if (WRAPPER_TAGS.has(tag.name)) {
      wrapperAttributes = tag.closing ? null : tag.attributes;
      continue;
    }

    if (tag.name === 'mxCell' && !tag.closing) {
      const cell = { ...tag.attributes, line: tag.line, geometry: null, loosePoints: new Set() };
      if (wrapperAttributes) {
        cell.id = wrapperAttributes.id;
        cell.value = wrapperAttributes.label ?? cell.value;
      }
      currentDiagram.cells.push(cell);
      currentCell = tag.selfClosing ? null : cell;
      continue;
    }
    if (tag.name === 'mxCell' && tag.closing) {
      currentCell = null;
      continue;
    }
    if (tag.name === 'mxGeometry' && currentCell && !tag.closing) currentCell.geometry = tag.attributes;
    if (tag.name === 'mxPoint' && currentCell && tag.attributes.as) currentCell.loosePoints.add(tag.attributes.as);
  }
  return diagrams;
}

function boxOf(cell) {
  const { x = '0', y = '0', width = '0', height = '0' } = cell.geometry ?? {};
  return { x: Number(x), y: Number(y), width: Number(width), height: Number(height) };
}

function boxesOverlap(first, second) {
  return first.x < second.x + second.width
    && second.x < first.x + first.width
    && first.y < second.y + second.height
    && second.y < first.y + first.height;
}

function checkIdentity(cells, errors) {
  const seenIds = new Set();
  for (const cell of cells) {
    if (!cell.id) errors.push(`linha ${cell.line}: célula sem id`);
    else if (seenIds.has(cell.id)) errors.push(`linha ${cell.line}: id "${cell.id}" duplicado`);
    seenIds.add(cell.id);
  }

  const rootCell = cells.find((cell) => cell.id === '0');
  if (!rootCell || rootCell.parent) errors.push('falta <mxCell id="0"/> sem parent (raiz)');
  if (!cells.some((cell) => cell.parent === '0')) errors.push('falta ao menos uma camada <mxCell id="1" parent="0"/>');
}

function checkReferences(cells, cellsById, errors, warnings) {
  for (const cell of cells) {
    if (cell.parent && !cellsById.has(cell.parent)) {
      errors.push(`linha ${cell.line}: "${cell.id}" aponta parent="${cell.parent}" inexistente`);
    }

    if (cell.edge === '1') {
      for (const end of ['source', 'target']) {
        if (cell[end] && !cellsById.has(cell[end])) errors.push(`linha ${cell.line}: aresta "${cell.id}" com ${end}="${cell[end]}" inexistente`);
        if (!cell[end] && !cell.loosePoints.has(`${end}Point`)) errors.push(`linha ${cell.line}: aresta "${cell.id}" sem ${end} nem ${end}Point`);
      }
      if (cell.geometry?.relative !== '1') warnings.push(`linha ${cell.line}: aresta "${cell.id}" sem mxGeometry relative="1"`);
      continue;
    }

    if (cell.vertex === '1') {
      const box = boxOf(cell);
      if (!(box.width > 0 && box.height > 0)) errors.push(`linha ${cell.line}: vértice "${cell.id}" sem width/height`);
      if (cell.value?.includes('&lt;') && !cell.style?.includes('html=1')) {
        warnings.push(`linha ${cell.line}: "${cell.id}" tem HTML no rótulo sem html=1 no style — as tags aparecerão literais`);
      }
      continue;
    }

    if (cell.id !== '0' && cell.parent !== '0') warnings.push(`linha ${cell.line}: "${cell.id}" não é vertex nem edge`);
  }
}

function checkLayout(cells, cellsById, warnings) {
  const layoutVertices = cells.filter((cell) => {
    const parent = cellsById.get(cell.parent);
    return cell.vertex === '1' && cell.geometry?.relative !== '1' && parent?.edge !== '1';
  });

  for (const child of layoutVertices) {
    const parent = cellsById.get(child.parent);
    if (parent?.vertex !== '1') continue;
    const childBox = boxOf(child);
    const parentBox = boxOf(parent);
    const escapesParent = childBox.x < 0 || childBox.y < 0
      || childBox.x + childBox.width > parentBox.width
      || childBox.y + childBox.height > parentBox.height;
    if (escapesParent) warnings.push(`"${child.id}" transborda o container "${parent.id}" (coordenadas do filho são relativas ao pai)`);
  }

  for (let first = 0; first < layoutVertices.length; first += 1) {
    for (let second = first + 1; second < layoutVertices.length; second += 1) {
      const [a, b] = [layoutVertices[first], layoutVertices[second]];
      if (a.parent === b.parent && boxesOverlap(boxOf(a), boxOf(b))) {
        warnings.push(`"${a.id}" e "${b.id}" se sobrepõem`);
      }
    }
  }
}

/**
 * Aplica as regras estruturais e de layout a uma página do diagrama.
 *
 * @returns Erros (bloqueiam a entrega) e avisos (revisar antes de entregar)
 */
function validateDiagram(diagram) {
  const errors = [];
  const warnings = [];

  if (!diagram.hasModel) {
    errors.push('página comprimida — salve descomprimido (Arquivo › Propriedades › desmarcar "Comprimido")');
    return { errors, warnings };
  }

  const cellsById = new Map(diagram.cells.map((cell) => [cell.id, cell]));
  checkIdentity(diagram.cells, errors);
  checkReferences(diagram.cells, cellsById, errors, warnings);
  checkLayout(diagram.cells, cellsById, warnings);

  const vertexCount = diagram.cells.filter((cell) => cell.vertex === '1').length;
  if (vertexCount > MAX_VERTICES_PER_PAGE) warnings.push(`${vertexCount} vértices — acima de ${MAX_VERTICES_PER_PAGE}, divida em mais páginas ou desça um nível C4`);
  if (!diagram.cells.some((cell) => /legenda/i.test(cell.value ?? ''))) warnings.push('página sem legenda');

  return { errors, warnings };
}

function validateFile(filePath) {
  const xml = readFileSync(filePath, 'utf8');
  const { tags, errors: syntaxErrors } = tokenize(xml);
  const fileErrors = [...syntaxErrors, ...checkTagBalance(tags), ...checkAttributeEscaping(tags)];

  if (!tags.some((tag) => tag.name === 'mxfile')) fileErrors.push('raiz <mxfile> ausente');
  const diagrams = collectDiagrams(tags);
  if (diagrams.length === 0) fileErrors.push('nenhuma página <diagram> encontrada');

  const report = [`\n${basename(filePath)} — ${diagrams.length} página(s)`];
  let errorCount = fileErrors.length;
  fileErrors.forEach((message) => report.push(`  ✖ ${message}`));

  for (const diagram of diagrams) {
    const { errors, warnings } = validateDiagram(diagram);
    const vertices = diagram.cells.filter((cell) => cell.vertex === '1').length;
    const edges = diagram.cells.filter((cell) => cell.edge === '1').length;
    report.push(`  • ${diagram.name}: ${vertices} vértices, ${edges} arestas`);
    errors.forEach((message) => report.push(`    ✖ ${message}`));
    warnings.forEach((message) => report.push(`    ⚠ ${message}`));
    errorCount += errors.length;
  }

  report.push(errorCount === 0 ? '  ✔ estrutura válida' : `  ✖ ${errorCount} erro(s)`);
  console.log(report.join('\n'));
  return errorCount;
}

const filePaths = process.argv.slice(2);
if (filePaths.length === 0) {
  console.error('Uso: node validate-drawio.mjs <arquivo.drawio> [outro.drawio ...]');
  process.exit(2);
}

const totalErrors = filePaths.reduce((sum, filePath) => sum + validateFile(filePath), 0);
process.exit(totalErrors === 0 ? 0 : 1);
