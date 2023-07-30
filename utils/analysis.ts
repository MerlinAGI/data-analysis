import {
  AnalysisConfig,
  AnalysisField,
  Answers,
  QuestionInfo,
  SurveyData,
  SurveyRevision,
  SurveyWithRevisionsAndAnalysis
} from './types';

const base_desc =
  "Answer all question concisely, in first person, anonymous. Eg. 'too long' and NOT 'the user said it was too long'. Still include everything the user said.";

const base_q_desc = 'ALL user-given information related to: {{question}}';

export const sync_analysis_with_questions = (
  analysis: AnalysisConfig | undefined,
  questions: QuestionInfo[]
) => {
  let fields = analysis?.fields ?? [];
  // 1. remove questions
  fields = fields.filter(
    (f) => f.type !== 'question' || questions.find((q) => q.id === f.id)
  );
  // if null, add summary as default
  if (!analysis) {
    fields.push({
      type: 'additional',
      id: '5umm4ry0-0000-0000-0000-000000000000',
      title: 'Summary',
      description:
        'Summary of all of the user messages. Contains all info but very concise.',
      data_type: 'text'
    });
  }
  // 2. add questions
  questions.forEach((q) => {
    if (!fields.find((f) => f.id === q.id)) {
      fields.push({
        type: 'question',
        id: q.id,
        title: '{{question}}',
        description: base_q_desc,
        disabled: false,
        data_type: 'text'
      });
    }
  });
  return fields;
};

export const get_analysis_config_from_data = (
  analysis: AnalysisConfig | undefined,
  survey_data: SurveyData
): AnalysisConfig => {
  // sync questions
  const general_description = analysis?.general_description ?? base_desc;
  const fields = sync_analysis_with_questions(analysis, survey_data.questions);
  return { general_description, fields };
};

export const get_analysis_config = (survey: SurveyWithRevisionsAndAnalysis) => {
  const analysis = survey?.analysis_revisions?.[0]?.data;
  const survey_data = survey?.survey_revisions?.[0]?.data;
  if (!survey_data) throw new Error('Survey data not found');
  return get_analysis_config_from_data(analysis, survey_data);
};

export const format_analysis_text = (
  text: string,
  id: string,
  questions: QuestionInfo[]
) =>
  text.replace(/{{question}}/g, questions.find((q) => q.id === id)?.ask ?? '');

export const getFieldResonse = ({
  answers,
  fields,
  index
}: {
  answers: Answers | null;
  fields: AnalysisField[];
  index: number;
}) => {
  if (!answers?.answers) return;
  const field = fields[index];
  if (Array.isArray(answers.answers)) {
    if (answers.answers.length < fields.length && answers.summary) {
      if (field.title.toLowerCase() === 'summary') {
        return answers.summary;
      }
      return answers.answers[index - 1] || '';
    }
    return answers.answers[index] || '';
  } else {
    const val = answers.answers[field.id];
    if (typeof val === 'object') {
      return val.content;
    }
    let v = val as string | undefined;
    if (!v && field.title.toLowerCase() === 'summary') {
      v = answers?.summary;
    }
    return v;
  }
};
