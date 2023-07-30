import React from 'react';
import { Card } from 'antd';
import { MdOutlineExpandMore } from 'react-icons/md';
import { FiExternalLink } from 'react-icons/fi';
import clsx from 'clsx';
import Link from 'next/link';

export type ClusterData = {
  theme: string;
  summary: string;
  response_ids: string[];
  top_3_quotes: { quote: string; id: string }[];
};
export type ClusterDataIdNumber = {
  theme: string;
  summary: string;
  response_ids: number[];
  top_3_quotes: { quote: string; id: number }[];
};
type ResponseMap = { [id: string]: string | undefined };

export const Cluster = ({
  cluster,
  response_map
}: {
  cluster: ClusterData;
  response_map: ResponseMap;
}) => {
  const { theme, summary, response_ids, top_3_quotes: quotes } = cluster;
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const percentage = Math.round(
    (response_ids.length / Object.keys(response_map).length) * 100
  );
  return (
    <Card
      title={
        <div>
          {theme}
          <div className="absolute right-4 top-4 text-green-500">
            {percentage}% of users mentioned{' '}
          </div>
        </div>
      }
      bordered={true}
      className="w-full mb-4"
    >
      {/* <Card title="Summary" bordered={true} className="w-full mb-4">
        {summary}
      </Card> */}
      <h2 className="font-bold mb-2">Summary</h2>
      <div className="p-4 mb-2 rounded border border-[#f0f0f0]">{summary}</div>
      <h2 className="font-bold">Quotes</h2>
      <div className="flex flex-wrap justify-start">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="m-2 ml-0 pl-4 pr-2 py-2 rounded bordered border border-[#f0f0f0] flex flex-row align-baseline"
          >
            <span>"{quote.quote}"</span>
            <Link
              className="pl-1 flex items-center"
              href={`/result/${quote.id}`}
            >
              <FiExternalLink color="gray" size="0.8em" />
            </Link>
          </div>
        ))}
      </div>
      <div
        className={clsx(
          isCollapsed && 'max-h-0',
          !isCollapsed && 'max-h-[300px]',
          'overflow-hidden transition-all duration-500',
          'flex flex-wrap justify-start'
        )}
      >
        {response_ids
          .filter((id) => response_map[id] && !quotes.find((q) => q.id === id))
          .map((id) => (
            <div
              key={id}
              className="m-2 ml-0 pl-4 pr-2 py-2 rounded bordered border border-[#f0f0f0] flex flex-row align-baseline"
            >
              <span>"{response_map[id]}"</span>
              <Link className="pl-1 flex items-center" href={`/result/${id}`}>
                <FiExternalLink color="gray" size="0.8em" />
              </Link>
            </div>
          ))}
      </div>
      <div className="w-full flex flex-row justify-center">
        <button className="p-2" onClick={() => setIsCollapsed(!isCollapsed)}>
          <MdOutlineExpandMore
            size={25}
            color="gray"
            className={clsx(
              !isCollapsed && 'rotate-180',
              'transition-transform duration-300'
            )}
          />
        </button>
      </div>
    </Card>
  );
};
