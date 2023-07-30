'use client';
import React, { useState } from 'react';

import { SurveyWithRespones } from '@/utils/types';
import { BarChartAnalysis } from './BarChartAnalysis';
import { Input } from 'antd';
const { Search } = Input;
import { Card } from 'antd';
import { responses_map_from_field } from './run_insights';
import { Cluster } from './Cluster';
import { example_data } from './example_data';
import clsx from 'clsx';

const Analysis = ({ survey }: { survey: SurveyWithRespones }) => {
  const [question, setQuestion] = useState('');
  const [lastQuestion, setLastQuestion] = useState(' ');
  const [loading, setLoading] = useState(false);
  const askQuestion = (value: string) => {
    setLoading(true);
    setLastQuestion(value);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const response_map = responses_map_from_field({ survey, fieldIndex: 9 });

  return (
    <div>
      <Search
        placeholder="input search text"
        enterButton="Ask"
        size="large"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onSearch={askQuestion}
        loading={loading}
        className="mb-4"
      />
      {lastQuestion === '' ? null : (
        <div
          className={clsx(
            loading && 'opacity-0',
            'transition-opacity duration-500'
          )}
        >
          <Card title="AI Summary ✨" bordered={true} className="w-full mb-4">
            <p>
              People primarily consider dining out as a treat or reward, usually
              at the end of the work week. This is closely tied with the social
              aspect of eating out and the practicality of it, especially when
              they're tired or have busy schedules. However, some are
              discouraged due to dietary restrictions or financial constraints.
              Despite these, a number of individuals still prefer home-cooking,
              either due to personal choice, distance to restaurants, or dietary
              limitations.
            </p>
          </Card>
          <BarChartAnalysis
            data={example_data}
            resp_cnt={Object.keys(response_map).length}
          />
          {example_data.map((cluster) => (
            <Cluster cluster={cluster} response_map={response_map} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Analysis;
