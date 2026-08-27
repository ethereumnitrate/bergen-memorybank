import { readFileSync } from 'node:fs';

const courseTransferSchema = JSON.parse(readFileSync(
  new URL('./bergen-course-transfer-v0.1.json', import.meta.url),
  'utf8',
));

const PRIVACY_ERROR = Object.freeze({
  path: '$',
  code: 'protected_information',
  message: 'Protected or identifiable student information is not accepted. Keep student records in Canvas and retry with de-identified course-design content.',
});

const COLLECTION_TYPES = Object.freeze({
  modules: 'module',
  pages: 'page',
  assignments: 'assignment',
  discussions: 'discussion',
  rubrics: 'rubric',
  quizzes: 'quiz',
  exams: 'exam',
  completionRules: 'completion-rule',
});

const MODULE_ITEM_TYPES = Object.freeze({
  pages: 'page',
  assignments: 'assignment',
  discussions: 'discussion',
  quizzes: 'quiz',
  exams: 'exam',
});

const CONTENT_TYPES = new Set(Object.values(MODULE_ITEM_TYPES));
const SCORE_SCALE = 1_000_000;
const MAX_MARKUP_ENTITY_DECODE_PASSES = 4;
const PLACEHOLDER_PATTERN = /(?:<\s*(?:TODO|TBD|INSERT|PLACEHOLDER)[^>]*>|\b(?:TODO|TBD|lorem ipsum|placeholder content|sample content|hidden[- ]memory)\b)/i;
const PROTECTED_TEXT_PATTERNS = Object.freeze([
  /\b(?:student|bergen)[- _]?(?:id|number)\s*(?::|-|is|=)?\s*\d{6,10}\b/i,
  /\b(?:student|learner|pupil)(?:\s+(?:full\s+)?name)?\s*(?::|-|is)\s*[A-Z][A-Za-z'’\-]+(?:\s+[A-Z][A-Za-z'’\-]+){1,3}\b/i,
  /\b(?:student|learner|pupil)\s+(?:named|called)\s+[A-Z][A-Za-z'’\-]+(?:\s+[A-Z][A-Za-z'’\-]+){1,3}\b/i,
  /\b(?:student|learner|pupil)(?:\s+email)?\s*(?::|-|is)\s*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:the|this|that|one)\s+student(?:'s)?\b.{0,120}\b(?:accommodation|disability|diabetes|diagnos(?:is|ed)|medical condition|health condition)\b/is,
  /\b(?:accommodation|disability|diabetes|diagnos(?:is|ed)|medical condition|health condition)\b.{0,120}\b(?:the|this|that|one)\s+student\b/is,
  /\bstudent(?:'s)?\s+(?:individual\s+)?(?:grade|score|feedback|accommodation|disability|diagnosis|health information|medical information)\b/i,
  /\b(?:the|this|that|one)\s+student\b.{0,120}\b(?:earned|received|has)\b.{0,80}\b(?:grade|score|feedback)\b/is,
  /\bindividual\s+(?:student\s+)?(?:grade|score|feedback)\b/i,
  /\b(?:api[- _]?key|password|passphrase|client[- _]?secret|access[- _]?token|refresh[- _]?token)\s*(?::|-|is|=)\s*[^\s,;]{8,}/i,
  /\bbearer\s+[A-Za-z0-9._~+\/-]{12,}\b/i,
]);
const PROTECTED_NORMALIZED_KEYS = new Set([
  'studentname',
  'studentid',
  'studentnumber',
  'studentemail',
  'individualgrade',
  'individualscore',
  'individualfeedback',
  'accommodation',
  'disability',
  'healthrecord',
  'disciplinaryrecord',
  'rawstudentwork',
  'password',
  'passphrase',
  'accesstoken',
  'refreshtoken',
  'apikey',
  'clientsecret',
  'secret',
  'credential',
]);
const SAFE_PRIVACY_INDICATORS = new Set([
  'containsRealStudentData',
  'containsProtectedInformation',
  'containsIdentifiableStudentInformation',
  'containsCredentials',
  'containsRawStudentWork',
  'canvasStudentRecordsExcluded',
]);

function propertyPath(path, property) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(property)
    ? `${path}.${property}`
    : `${path}[${JSON.stringify(property)}]`;
}

function addError(errors, path, code, message) {
  errors.push({ path, code, message });
}

function sortAndDedupeErrors(errors) {
  const unique = new Map();
  for (const error of errors) {
    unique.set(`${error.path}\u0000${error.code}\u0000${error.message}`, error);
  }
  return [...unique.values()].sort((left, right) => compareCodePoints(
    `${left.path}\u0000${left.code}\u0000${left.message}`,
    `${right.path}\u0000${right.code}\u0000${right.message}`,
  ));
}

function compareCodePoints(left, right) {
  const leftCodePoints = [...left];
  const rightCodePoints = [...right];
  const length = Math.min(leftCodePoints.length, rightCodePoints.length);
  for (let index = 0; index < length; index += 1) {
    const difference = leftCodePoints[index].codePointAt(0) - rightCodePoints[index].codePointAt(0);
    if (difference !== 0) return difference;
  }
  return leftCodePoints.length - rightCodePoints.length;
}

function specialCode(path, fallback) {
  if (path === '$.format') return 'unsupported_format';
  if (path === '$.version') return 'unsupported_version';
  if (path === '$.metadata.finalReviewApproved') return 'final_review_approval_required';
  if (path === '$.metadata.packageApproved') return 'package_approval_required';
  if (path === '$.privacy.inputDerived') return 'input_derived_required';
  if (path.endsWith('.published')) return 'must_be_unpublished';
  return fallback;
}

function messageFor(code) {
  const messages = {
    additional_property: 'This property is not allowed by the Bergen Course Transfer Block contract.',
    const: 'This value does not match the required contract value.',
    enum: 'This value is not one of the supported contract values.',
    final_review_approval_required: 'Whole-course final-review approval is required before transfer generation.',
    input_derived_required: 'Course transfer content must come from the current approved course.',
    integer: 'This value must be an integer.',
    max_items: 'This array exceeds the contract limit.',
    maximum: 'This number exceeds the contract maximum.',
    max_length: 'This text exceeds the contract limit.',
    min_items: 'This array does not contain enough items.',
    minimum: 'This number is below the contract minimum.',
    min_length: 'This text is empty.',
    must_be_unpublished: 'Every Canvas-facing entity must remain unpublished for faculty sandbox review.',
    package_approval_required: 'Separate package approval is required before transfer generation.',
    pattern: 'This value does not match the required contract pattern.',
    required: 'This required property is missing.',
    type: 'This value has the wrong JSON type.',
    unique_items: 'This array contains duplicate values.',
    unsupported_format: 'Only the bergen-course-transfer format is supported.',
    unsupported_version: 'Only Bergen Course Transfer Block version 0.1 is supported.',
  };
  return messages[code] ?? 'This value violates the Bergen Course Transfer Block contract.';
}

function resolveSchemaReference(reference) {
  const prefix = '#/$defs/';
  if (!reference.startsWith(prefix)) return null;
  return courseTransferSchema.$defs[reference.slice(prefix.length)] ?? null;
}

function matchesType(value, type) {
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'array') return Array.isArray(value);
  if (type === 'string') return typeof value === 'string';
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'boolean') return typeof value === 'boolean';
  return true;
}

function validateSchema(schema, value, path, errors) {
  if (schema.$ref) {
    const resolved = resolveSchemaReference(schema.$ref);
    if (!resolved) {
      addError(errors, path, 'invalid_contract_reference', 'The repository-owned contract contains an unresolved schema reference.');
      return;
    }
    validateSchema(resolved, value, path, errors);
    return;
  }

  if (schema.type && !matchesType(value, schema.type)) {
    const code = schema.type === 'integer' && typeof value === 'number' ? 'integer' : 'type';
    addError(errors, path, code, messageFor(code));
    return;
  }

  if (Object.hasOwn(schema, 'const') && !Object.is(value, schema.const)) {
    const code = specialCode(path, 'const');
    addError(errors, path, code, messageFor(code));
  }
  if (schema.enum && !schema.enum.some((candidate) => Object.is(candidate, value))) {
    addError(errors, path, 'enum', messageFor('enum'));
  }

  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      addError(errors, path, 'min_length', messageFor('min_length'));
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      addError(errors, path, 'max_length', messageFor('max_length'));
    }
    if (schema.pattern && !(new RegExp(schema.pattern).test(value))) {
      addError(errors, path, 'pattern', messageFor('pattern'));
    }
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    if (schema.minimum !== undefined && value < schema.minimum) {
      addError(errors, path, 'minimum', messageFor('minimum'));
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      addError(errors, path, 'maximum', messageFor('maximum'));
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      addError(errors, path, 'min_items', messageFor('min_items'));
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      addError(errors, path, 'max_items', messageFor('max_items'));
    }
    if (schema.uniqueItems) {
      const serialized = value.map((item) => JSON.stringify(item));
      if (new Set(serialized).size !== serialized.length) {
        addError(errors, path, 'unique_items', messageFor('unique_items'));
      }
    }
    if (schema.items) {
      value.forEach((item, index) => validateSchema(schema.items, item, `${path}[${index}]`, errors));
    }
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const properties = schema.properties ?? {};
    for (const required of schema.required ?? []) {
      if (!Object.hasOwn(value, required)) {
        const requiredPath = propertyPath(path, required);
        const code = specialCode(requiredPath, 'required');
        addError(errors, requiredPath, code, messageFor(code));
      }
    }
    if (schema.additionalProperties === false) {
      for (const property of Object.keys(value)) {
        if (!Object.hasOwn(properties, property)) {
          addError(errors, propertyPath(path, property), 'additional_property', messageFor('additional_property'));
        }
      }
    }
    for (const [property, propertySchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, property)) {
        validateSchema(propertySchema, value[property], propertyPath(path, property), errors);
      }
    }
  }
}

function rawInputHasProtectedInformation(source) {
  return textHasProtectedInformation(source)
    || /"(?:student[-_ ]?(?:name|id|number|email)|individual[-_ ]?(?:grade|score|feedback)|accommodation|disability|health[-_ ]?record|disciplinary[-_ ]?record|raw[-_ ]?student[-_ ]?work|password|passphrase|access[-_ ]?token|refresh[-_ ]?token|api[-_ ]?key|client[-_ ]?secret|secret|credential)"\s*:/i.test(source)
    || /"(?:containsRealStudentData|containsProtectedInformation|containsIdentifiableStudentInformation|containsCredentials|containsRawStudentWork)"\s*:\s*true\b/i.test(source);
}

function textHasProtectedInformation(value) {
  return PROTECTED_TEXT_PATTERNS.some((pattern) => pattern.test(value));
}

function keyHasProtectedInformation(key) {
  if (SAFE_PRIVACY_INDICATORS.has(key)) return false;
  return PROTECTED_NORMALIZED_KEYS.has(key.replace(/[^A-Za-z0-9]/g, '').toLowerCase());
}

function objectHasProtectedInformation(value) {
  if (value === null || typeof value !== 'object') return false;
  if (value.metadata?.containsRealStudentData === true
    || value.privacy?.containsProtectedInformation === true
    || value.privacy?.containsIdentifiableStudentInformation === true
    || value.privacy?.containsCredentials === true
    || value.privacy?.containsRawStudentWork === true) {
    return true;
  }

  const seen = new WeakSet();
  const inspect = (candidate) => {
    if (typeof candidate === 'string') return textHasProtectedInformation(candidate);
    if (candidate === null || typeof candidate !== 'object') return false;
    if (seen.has(candidate)) return false;
    seen.add(candidate);
    for (const [key, nested] of Object.entries(candidate)) {
      if (keyHasProtectedInformation(key)) return true;
      if (inspect(nested)) return true;
    }
    return false;
  };
  return inspect(value);
}

function walkStrings(value, path, visitor) {
  if (typeof value === 'string') {
    visitor(value, path);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkStrings(item, `${path}[${index}]`, visitor));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [property, nested] of Object.entries(value)) {
      walkStrings(nested, propertyPath(path, property), visitor);
    }
  }
}

function decodeMarkupEntitiesOnce(value) {
  return value
    .replace(/&#x([0-9a-f]+);?/gi, (match, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      return Number.isInteger(codePoint) && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    })
    .replace(/&#([0-9]+);?/g, (match, decimal) => {
      const codePoint = Number.parseInt(decimal, 10);
      return Number.isInteger(codePoint) && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    })
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&colon;/gi, ':')
    .replace(/&tab;/gi, '\t')
    .replace(/&newline;/gi, '\n')
    .replace(/&amp;/gi, '&');
}

function decodeMarkupEntities(value) {
  let decoded = value;
  for (let pass = 0; pass < MAX_MARKUP_ENTITY_DECODE_PASSES; pass += 1) {
    const next = decodeMarkupEntitiesOnce(decoded);
    if (next === decoded) return { decoded, decodeDepthExceeded: false };
    decoded = next;
  }
  return {
    decoded,
    decodeDepthExceeded: decodeMarkupEntitiesOnce(decoded) !== decoded,
  };
}

function hasUnsafeMarkup(value) {
  const { decoded, decodeDepthExceeded } = decodeMarkupEntities(value);
  return decodeDepthExceeded
    || /<\/?[A-Za-z][A-Za-z0-9:_-]*/.test(decoded)
    || /(?:<\?\s*[A-Za-z]|<\s*!\s*(?:--|\[CDATA\[|DOCTYPE\b|ENTITY\b|ELEMENT\b|ATTLIST\b|NOTATION\b)|@import\b|\bexpression\s*\(|\burl\s*\(|\b(?:javascript|vbscript)\s*:|\bdata\s*:\s*text\/html|\u0000)/i.test(decoded);
}

function normalizedScore(value) {
  return Math.round(value * SCORE_SCALE);
}

function scoresEqual(left, right) {
  return normalizedScore(left) === normalizedScore(right);
}

function scoreGreaterThan(left, right) {
  return normalizedScore(left) > normalizedScore(right);
}

function registerIdentifiers(course, errors) {
  const entities = new Map();
  const register = (id, type, path, value) => {
    if (typeof id !== 'string') return;
    if (entities.has(id)) {
      addError(errors, path, 'duplicate_identifier', 'Identifiers must be unique across the complete course transfer block.');
      return;
    }
    entities.set(id, { type, path, value });
  };

  for (const [collection, type] of Object.entries(COLLECTION_TYPES)) {
    if (!Array.isArray(course[collection])) continue;
    course[collection].forEach((entity, index) => {
      if (entity && typeof entity === 'object') {
        register(entity.id, type, `$.${collection}[${index}].id`, entity);
      }
    });
  }
  if (Array.isArray(course.rubrics)) {
    course.rubrics.forEach((rubric, rubricIndex) => {
      if (!Array.isArray(rubric?.criteria)) return;
      rubric.criteria.forEach((criterion, criterionIndex) => register(
        criterion?.id,
        'rubric-criterion',
        `$.rubrics[${rubricIndex}].criteria[${criterionIndex}].id`,
        criterion,
      ));
    });
  }
  for (const collection of ['quizzes', 'exams']) {
    if (!Array.isArray(course[collection])) continue;
    course[collection].forEach((assessment, assessmentIndex) => {
      if (!Array.isArray(assessment?.questions)) return;
      assessment.questions.forEach((question, questionIndex) => register(
        question?.id,
        'assessment-question',
        `$.${collection}[${assessmentIndex}].questions[${questionIndex}].id`,
        question,
      ));
    });
  }
  return entities;
}

function validateOrderingAndPlacement(course, entities, errors) {
  if (!Array.isArray(course.modules)) return;
  if (!course.modules.every((module, index) => module?.position === index + 1)) {
    addError(errors, '$.modules', 'position_sequence', 'Module positions must be unique, ordered, and contiguous from 1.');
  }

  const placements = new Map();
  course.modules.forEach((module, moduleIndex) => {
    if (!Array.isArray(module?.items)) return;
    const itemsPath = `$.modules[${moduleIndex}].items`;
    if (!module.items.every((item, index) => item?.position === index + 1)) {
      addError(errors, itemsPath, 'position_sequence', 'Module item positions must be unique, ordered, and contiguous from 1.');
    }
    module.items.forEach((item, itemIndex) => {
      if (!item || typeof item !== 'object' || typeof item.ref !== 'string') return;
      const refPath = `${itemsPath}[${itemIndex}].ref`;
      if (placements.has(item.ref)) {
        addError(errors, refPath, 'duplicate_module_item_ref', 'Each Canvas content item must appear in exactly one module position.');
      } else {
        placements.set(item.ref, { moduleId: module.id, path: refPath });
      }
      const target = entities.get(item.ref);
      if (!target) {
        addError(errors, refPath, 'unresolved_reference', 'This module item reference does not resolve to course content.');
      } else if (target.type !== item.type) {
        addError(errors, `${itemsPath}[${itemIndex}].type`, 'reference_type_mismatch', 'The declared module item type must match the referenced content type.');
      }
    });
  });

  for (const [collection, type] of Object.entries(MODULE_ITEM_TYPES)) {
    if (!Array.isArray(course[collection])) continue;
    course[collection].forEach((item, index) => {
      if (typeof item?.id === 'string' && !placements.has(item.id)) {
        addError(errors, `$.${collection}[${index}].id`, 'unplaced_content', `Every ${type} must appear in exactly one ordered module.`);
      }
    });
  }
}

function sumPoints(criteria) {
  if (!Array.isArray(criteria) || !criteria.every((criterion) => (
    criterion !== null && typeof criterion === 'object'
      && typeof criterion.points === 'number' && Number.isFinite(criterion.points)
  ))) {
    return null;
  }
  return criteria.reduce((total, criterion) => total + criterion.points, 0);
}

function validateRubricRelationships(course, entities, referenceKeys, errors) {
  const validateRubric = (item, path, requirePointMatch) => {
    if (!item || typeof item !== 'object' || typeof item.rubricRef !== 'string') return;
    const rubric = entities.get(item.rubricRef);
    if (!rubric || rubric.type !== 'rubric') {
      addError(errors, `${path}.rubricRef`, 'unresolved_reference', 'The rubric reference must resolve to a rubric in this course.');
    } else if (requirePointMatch) {
      const rubricPoints = sumPoints(rubric.value.criteria);
      if (rubricPoints !== null && typeof item.pointsPossible === 'number' && !scoresEqual(rubricPoints, item.pointsPossible)) {
        addError(errors, `${path}.pointsPossible`, 'rubric_points_mismatch', 'Points possible must equal the sum of the referenced rubric criteria.');
      }
    }
    if (!referenceKeys.has(`${item.id}\u0000${item.rubricRef}\u0000uses-rubric`)) {
      addError(errors, `${path}.rubricRef`, 'missing_relationship', 'Each rubricRef must have a matching uses-rubric relationship.');
    }
  };

  if (Array.isArray(course.assignments)) {
    course.assignments.forEach((item, index) => validateRubric(item, `$.assignments[${index}]`, true));
  }
  if (Array.isArray(course.discussions)) {
    course.discussions.forEach((item, index) => {
      validateRubric(item, `$.discussions[${index}]`, item?.graded === true);
      if (item?.graded === false && item.pointsPossible !== 0) {
        addError(errors, `$.discussions[${index}].pointsPossible`, 'ungraded_points', 'An ungraded discussion must have zero points possible.');
      }
    });
  }
}

function requireQuestionField(question, path, field, errors) {
  if (!Array.isArray(question?.[field]) || question[field].length === 0) {
    addError(errors, `${path}.${field}`, 'required_question_field', `Question type ${question?.type ?? 'unknown'} requires ${field}.`);
    return false;
  }
  return true;
}

function forbidQuestionField(question, path, field, errors) {
  if (Object.hasOwn(question ?? {}, field)) {
    addError(errors, `${path}.${field}`, 'forbidden_question_field', `Question type ${question?.type ?? 'unknown'} does not permit ${field}.`);
  }
}

function validateAssessments(course, errors) {
  for (const collection of ['quizzes', 'exams']) {
    if (!Array.isArray(course[collection])) continue;
    course[collection].forEach((assessment, assessmentIndex) => {
      const assessmentPath = `$.${collection}[${assessmentIndex}]`;
      if (!Array.isArray(assessment?.questions)) return;
      const questionPoints = assessment.questions.every((question) => (
        question !== null && typeof question === 'object'
          && typeof question.points === 'number' && Number.isFinite(question.points)
      ))
        ? assessment.questions.reduce((total, question) => total + question.points, 0)
        : null;
      if (questionPoints !== null && typeof assessment.pointsPossible === 'number'
        && !scoresEqual(assessment.pointsPossible, questionPoints)) {
        addError(errors, `${assessmentPath}.pointsPossible`, 'question_points_mismatch', 'Assessment points possible must equal the sum of question points.');
      }
      assessment.questions.forEach((question, questionIndex) => {
        const questionPath = `${assessmentPath}.questions[${questionIndex}]`;
        const choiceType = ['multiple-choice', 'multiple-answer', 'true-false'].includes(question?.type);
        if (choiceType) {
          const hasChoices = requireQuestionField(question, questionPath, 'choices', errors);
          const hasIndexes = requireQuestionField(question, questionPath, 'correctChoiceIndexes', errors);
          forbidQuestionField(question, questionPath, 'acceptedAnswers', errors);
          if (hasChoices && new Set(question.choices).size !== question.choices.length) {
            addError(errors, `${questionPath}.choices`, 'duplicate_choice', 'Assessment choices must be unique.');
          }
          if (hasChoices && hasIndexes) {
            question.correctChoiceIndexes.forEach((choiceIndex, index) => {
              if (Number.isInteger(choiceIndex) && choiceIndex >= question.choices.length) {
                addError(errors, `${questionPath}.correctChoiceIndexes[${index}]`, 'choice_index_out_of_range', 'Correct answer indexes must resolve to an available choice.');
              }
            });
          }
          if (question.type === 'multiple-choice' && hasIndexes && question.correctChoiceIndexes.length !== 1) {
            addError(errors, `${questionPath}.correctChoiceIndexes`, 'answer_count', 'A multiple-choice question requires exactly one correct choice.');
          }
          if (question.type === 'multiple-answer' && hasIndexes && question.correctChoiceIndexes.length < 2) {
            addError(errors, `${questionPath}.correctChoiceIndexes`, 'answer_count', 'A multiple-answer question requires at least two correct choices.');
          }
          if (question.type === 'true-false' && hasChoices
            && (question.choices.length !== 2 || question.choices[0] !== 'True' || question.choices[1] !== 'False')) {
            addError(errors, `${questionPath}.choices`, 'true_false_choices', 'A true-false question must use choices in the order True, False.');
          }
          if (question.type === 'true-false' && hasIndexes && question.correctChoiceIndexes.length !== 1) {
            addError(errors, `${questionPath}.correctChoiceIndexes`, 'answer_count', 'A true-false question requires exactly one correct choice.');
          }
        } else if (question?.type === 'short-answer') {
          requireQuestionField(question, questionPath, 'acceptedAnswers', errors);
          forbidQuestionField(question, questionPath, 'choices', errors);
          forbidQuestionField(question, questionPath, 'correctChoiceIndexes', errors);
        } else if (question?.type === 'essay') {
          forbidQuestionField(question, questionPath, 'choices', errors);
          forbidQuestionField(question, questionPath, 'correctChoiceIndexes', errors);
          forbidQuestionField(question, questionPath, 'acceptedAnswers', errors);
        }
      });
    });
  }
}

function validateReferences(course, entities, errors) {
  const referenceKeys = new Set();
  if (!Array.isArray(course.references)) return referenceKeys;
  course.references.forEach((reference, index) => {
    if (!reference || typeof reference !== 'object') return;
    const path = `$.references[${index}]`;
    const key = `${reference.from}\u0000${reference.to}\u0000${reference.relation}`;
    if (referenceKeys.has(key)) {
      addError(errors, path, 'duplicate_relationship', 'Relationships must be unique.');
    }
    referenceKeys.add(key);
    const from = entities.get(reference.from);
    const to = entities.get(reference.to);
    if (!from) addError(errors, `${path}.from`, 'unresolved_reference', 'The relationship source does not resolve.');
    if (!to) addError(errors, `${path}.to`, 'unresolved_reference', 'The relationship target does not resolve.');
    if (!from || !to) return;

    let matches = false;
    if (reference.relation === 'contains') {
      matches = from.type === 'module' && CONTENT_TYPES.has(to.type)
        && from.value.items?.some((item) => item?.ref === reference.to);
    } else if (reference.relation === 'uses-rubric') {
      matches = ['assignment', 'discussion'].includes(from.type) && to.type === 'rubric'
        && from.value.rubricRef === reference.to;
    } else if (reference.relation === 'requires') {
      matches = from.type === 'module' && to.type === 'completion-rule'
        && to.value.moduleRef === reference.from
        && from.value.completionRuleRefs?.includes(reference.to);
    } else if (reference.relation === 'links-to') {
      matches = CONTENT_TYPES.has(from.type) && CONTENT_TYPES.has(to.type);
    }
    if (!matches) {
      addError(errors, path, 'relationship_type_mismatch', 'The relationship endpoints do not match the declared relationship type.');
    }
  });
  return referenceKeys;
}

function validateCompletionRules(course, entities, referenceKeys, errors) {
  const modules = new Map(Array.isArray(course.modules)
    ? course.modules.filter((module) => (
      module !== null && typeof module === 'object' && typeof module.id === 'string'
    )).map((module) => [module.id, module])
    : []);
  if (Array.isArray(course.completionRules)) {
    course.completionRules.forEach((rule, index) => {
      if (!rule || typeof rule !== 'object') return;
      const path = `$.completionRules[${index}]`;
      const module = modules.get(rule.moduleRef);
      if (!module) {
        addError(errors, `${path}.moduleRef`, 'unresolved_reference', 'The completion rule moduleRef does not resolve.');
      }
      const item = entities.get(rule.itemRef);
      if (!item || !CONTENT_TYPES.has(item.type)) {
        addError(errors, `${path}.itemRef`, 'unresolved_reference', 'The completion rule itemRef does not resolve to module content.');
      } else if (module && !module.items?.some((moduleItem) => moduleItem?.ref === rule.itemRef)) {
        addError(errors, `${path}.itemRef`, 'completion_item_not_in_module', 'The completion-rule item must belong to its referenced module.');
      }
      if (rule.requirement === 'score_at_least') {
        if (typeof rule.minimumScore !== 'number' || !Number.isFinite(rule.minimumScore)) {
          addError(errors, `${path}.minimumScore`, 'minimum_score_required', 'score_at_least requires a numeric minimumScore.');
        } else if (item && typeof item.value.pointsPossible === 'number'
          && scoreGreaterThan(rule.minimumScore, item.value.pointsPossible)) {
          addError(errors, `${path}.minimumScore`, 'minimum_score_exceeds_points', 'minimumScore cannot exceed the referenced item points possible.');
        }
      } else if (Object.hasOwn(rule, 'minimumScore')) {
        addError(errors, `${path}.minimumScore`, 'unexpected_minimum_score', 'minimumScore is allowed only for score_at_least.');
      }
      if (rule.requirement === 'submit' && item && !['assignment', 'discussion', 'quiz', 'exam'].includes(item.type)) {
        addError(errors, `${path}.requirement`, 'requirement_type_mismatch', 'submit applies only to submittable course items.');
      }
      if (rule.requirement === 'score_at_least' && item && !['assignment', 'discussion', 'quiz', 'exam'].includes(item.type)) {
        addError(errors, `${path}.requirement`, 'requirement_type_mismatch', 'score_at_least applies only to scored course items.');
      }
      if (module && !module.completionRuleRefs?.includes(rule.id)) {
        addError(errors, `${path}.moduleRef`, 'missing_module_completion_ref', 'The referenced module must list this completion rule.');
      }
      if (module && !referenceKeys.has(`${rule.moduleRef}\u0000${rule.id}\u0000requires`)) {
        addError(errors, `${path}.moduleRef`, 'missing_relationship', 'Each completion rule must have a matching module requires relationship.');
      }
    });
  }
  if (Array.isArray(course.modules)) {
    course.modules.forEach((module, moduleIndex) => {
      if (!Array.isArray(module?.completionRuleRefs)) return;
      module.completionRuleRefs.forEach((ref, refIndex) => {
        const rule = entities.get(ref);
        const path = `$.modules[${moduleIndex}].completionRuleRefs[${refIndex}]`;
        if (!rule || rule.type !== 'completion-rule') {
          addError(errors, path, 'unresolved_reference', 'The module completion-rule reference does not resolve.');
        } else if (rule.value.moduleRef !== module.id) {
          addError(errors, path, 'completion_module_mismatch', 'The completion rule must reference the module that lists it.');
        }
      });
    });
  }
}

function validateSemantics(course, errors) {
  walkStrings(course, '$', (value, path) => {
    if (value.length > 0 && value.trim().length === 0) {
      addError(errors, path, 'blank_text', 'Text values must contain non-whitespace content.');
    }
    if (PLACEHOLDER_PATTERN.test(value)) {
      addError(errors, path, 'placeholder_content', 'Placeholder, sample, and hidden-memory content are not allowed.');
    }
    if (hasUnsafeMarkup(value)) {
      addError(errors, path, 'unsafe_markup', 'Bergen Course Transfer Block content must be plain text without HTML, XML, CSS, executable URLs, or embedded objects.');
    }
  });

  if (course?.metadata?.courseCode !== undefined && course?.course?.code !== undefined
    && course.metadata.courseCode !== course.course.code) {
    addError(errors, '$.metadata.courseCode', 'course_mismatch', 'metadata.courseCode must match course.code.');
  }
  if (course?.metadata?.courseTitle !== undefined && course?.course?.title !== undefined
    && course.metadata.courseTitle !== course.course.title) {
    addError(errors, '$.metadata.courseTitle', 'course_mismatch', 'metadata.courseTitle must match course.title.');
  }

  const entities = registerIdentifiers(course, errors);
  validateOrderingAndPlacement(course, entities, errors);
  const referenceKeys = validateReferences(course, entities, errors);
  validateRubricRelationships(course, entities, referenceKeys, errors);
  validateAssessments(course, errors);
  validateCompletionRules(course, entities, referenceKeys, errors);
}

export class BergenCourseTransferValidationError extends Error {
  constructor(errors) {
    super(`Bergen Course Transfer Block validation failed with ${errors.length} correction${errors.length === 1 ? '' : 's'}.`);
    this.name = 'BergenCourseTransferValidationError';
    this.code = 'BERGEN_COURSE_TRANSFER_INVALID';
    this.errors = errors;
  }
}

export function validateBergenCourseTransfer(input) {
  if (typeof input === 'string' && rawInputHasProtectedInformation(input)) {
    return { ok: false, errors: [{ ...PRIVACY_ERROR }] };
  }
  if (typeof input !== 'string' && objectHasProtectedInformation(input)) {
    return { ok: false, errors: [{ ...PRIVACY_ERROR }] };
  }

  let value = input;
  if (typeof input === 'string') {
    let candidate = input.trim();
    const fenced = candidate.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (fenced) candidate = fenced[1];
    try {
      value = JSON.parse(candidate);
    } catch {
      return {
        ok: false,
        errors: [{ path: '$', code: 'invalid_json', message: 'Enter one complete JSON Bergen Course Transfer Block.' }],
      };
    }
    if (objectHasProtectedInformation(value)) {
      return { ok: false, errors: [{ ...PRIVACY_ERROR }] };
    }
  }

  try {
    JSON.stringify(value);
  } catch {
    return {
      ok: false,
      errors: [{ path: '$', code: 'invalid_json_value', message: 'The transfer value must be finite, acyclic, JSON-compatible data.' }],
    };
  }

  const errors = [];
  validateSchema(courseTransferSchema, value, '$', errors);
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    validateSemantics(value, errors);
  }
  const deterministicErrors = sortAndDedupeErrors(errors);
  if (deterministicErrors.length > 0) return { ok: false, errors: deterministicErrors };
  return { ok: true, value: structuredClone(value) };
}

export function parseBergenCourseTransferBlock(input) {
  const result = validateBergenCourseTransfer(input);
  if (!result.ok) throw new BergenCourseTransferValidationError(result.errors);
  return result.value;
}

export { courseTransferSchema };
