import {
  getFieldResonse,
  get_analysis_config_from_data
} from '@/utils/analysis';
import { anthropic_json } from '@/utils/anthropic';
import { Answers, SurveyWithRespones } from '@/utils/types';
import { ClusterData, ClusterDataIdNumber } from './Cluster';

export const responses_map_from_field = ({
  survey,
  fieldIndex
}: {
  survey: SurveyWithRespones;
  fieldIndex: number;
}) => {
  const responses = survey.survey_revisions.map((rev) => rev.responses).flat();
  const revs = survey.survey_revisions;
  const last_rev =
    new Date(revs[0].created_at) > new Date(revs[revs.length - 1].created_at)
      ? revs[0]
      : revs[revs.length - 1];
  const analysisConfig = get_analysis_config_from_data(
    survey.analysis_revisions[0]?.data,
    last_rev.data
  );
  const fields = analysisConfig.fields;
  const responsesMap = Object.fromEntries(
    responses
      .map((res, i) => [
        res.id,
        getFieldResonse({
          answers: res.answers as Answers | null,
          fields,
          index: fieldIndex
        })
      ])
      .filter(([, res]) => res)
  );
  return responsesMap;
};

export const run_insigths = async ({
  survey
}: {
  survey: SurveyWithRespones;
}) => {
  const fieldIndex = 9;
  const responses_map = responses_map_from_field({ survey, fieldIndex });
  const responses_keys = Object.keys(responses_map);
  const responses_list = responses_keys.map((id) => responses_map[id]);
  const resText = responses_list
    .map((res, i) => `<r id=${i}>${res}</r>`)
    .join('\n');
  const question =
    survey.survey_revisions[0].data.questions[fieldIndex - 1].ask; // TODO
  const prompt = `I have a list of responses to the question <question>${question}</question>. Cluster them and find groups of similar responses. Pay a lot of attention to match the ids with the right categorie. Make sure the content matches the theme well.
Here is the list:
${resText}

Put all responses that do not fit into a category into a category called "Other".

format the response in json like this:
[
{
  "theme": "3 word description",
  "response_ids": [1, 2], /* Responses that fit this theme very well*/
  "top_3_quotes": [
    {"id": 17, "quote": "short! excerpt from response, not the whole thing"},
    ... /* can be less than 3. Make sure the quotes are very relevant to the theme */
  ]
  "summary": "2-3 sentence summary of the theme and chosen reponses. Concise language.",
},
...
]`;
  console.log(prompt);
  const data = (await anthropic_json(prompt)) as ClusterDataIdNumber[];
  //console.log(data);
  // TODO replace all ids with real ids
  const data_with_ids = data.map((d) => ({
    ...d,
    response_ids: d.response_ids.map((id) => responses_keys[id]),
    top_3_quotes: d.top_3_quotes.map((q) => ({
      ...q,
      id: responses_keys[q.id]
    }))
  }));
  console.log(JSON.stringify(data_with_ids, null, 2));
};
