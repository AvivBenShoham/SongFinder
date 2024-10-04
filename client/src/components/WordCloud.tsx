import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { Box, Typography } from '@mui/material';

interface ExampleProps {
  width: number;
  height: number;
  words: WordData[];
}

export interface WordData {
  text: string;
  value: number;
}

const colors = ['#143059', '#2F6B9A', '#82a6c2'];

export default function WordCloud({ width, height, words }: ExampleProps) {        
    const fontScale = scaleLog({
      domain: [Math.min(...words.map((w) => w.size)), Math.max(...words.map((w) => w.size))],
      range: [10, 100],
    });
    const fontSizeSetter = (datum: WordData) => fontScale(datum.size);
    
    const fixedValueGenerator = () => 0.5;


  return (
    <div className="wordcloud">
        <Typography component="div" variant="h5" align="center" textAlign="center">
                Word Cloud By Word Occurences
        </Typography>
        <Box padding="1rem" />
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={'Impact'}
        padding={2}
        rotate={0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
                <Text
                key={w.text}
                fill={colors[i % colors.length]}
                textAnchor={'middle'}
                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
                >
                {w.text}
                </Text>
          ))
        }
      </Wordcloud>
      
      <style jsx>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
          align-self: center;
        }
        .wordcloud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}</style>
      
    </div>
  );
}