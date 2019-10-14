import { CanvasRenderingContext2D, createCanvas } from 'canvas';

interface Option {
  size: {
    width: number;
    height: number;
  };
  canvasStyle: {
    backgroundColor: string;
    padding: {
      horizontal: number;
      betweenTitleAndBody: number;
    };
  };
  siteNameStyle: {
    font: string;
    color: string;
  };
  titleStyle: {
    font: string;
    lineHeight: number;
    color: string;
  };
  bodyStyle: {
    font: string;
    lineHeight: number;
    color: string;
    marginTop: number;
  };
  dividerLineStyle: {
    lineWidth: number;
    color: string;
  };
}

const DEFAULT_OPTION = {
  size: {
    width: 1200,
    height: 630
  },
  canvasStyle: {
    backgroundColor: '#50c7a8',
    padding: {
      horizontal: 80,
      betweenTitleAndBody: 60
    }
  },
  siteNameStyle: {
    font: 'bold 20px "Noto Sans CJK JP"',
    color: '#ffffff'
  },
  titleStyle: {
    font: 'bold 70px "Noto Sans CJK JP"',
    lineHeight: 80,
    color: '#ffffff'
  },
  bodyStyle: {
    font: '32px "Noto Sans CJK JP"',
    lineHeight: 38,
    color: '#eeeeee'
  },
  dividerLineStyle: {
    lineWidth: 2,
    color: '#cccccc'
  }
};

export const renderImage = (title: string, body: string, option?: Partial<Option>) => {
  const {
    size = DEFAULT_OPTION.size,
    canvasStyle = DEFAULT_OPTION.canvasStyle,
    siteNameStyle = DEFAULT_OPTION.siteNameStyle,
    titleStyle = DEFAULT_OPTION.titleStyle,
    bodyStyle = DEFAULT_OPTION.bodyStyle,
    dividerLineStyle = DEFAULT_OPTION.dividerLineStyle
  } = option || DEFAULT_OPTION;

  const canvas = createCanvas(size.width, size.height);
  const ctx = canvas.getContext('2d');

  // 背景描画
  ctx.fillStyle = canvasStyle.backgroundColor;
  ctx.fillRect(0, 0, size.width, size.height);

  // サイト名
  ctx.fillStyle = siteNameStyle.color;
  ctx.font = siteNameStyle.font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'end';
  ctx.fillText('お題メーカー', size.width * 0.95, size.height * 0.95);

  // タイトル描画
  ctx.fillStyle = titleStyle.color;
  ctx.font = titleStyle.font;
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'center';
  const titleBaseLine = size.height * 0.46;
  const titleLines = createWrappedTextlines(title, size.width - canvasStyle.padding.horizontal * 2, ctx);
  titleLines
    .slice()
    .reverse()
    .forEach((line, i) => {
      const height = titleBaseLine - titleStyle.lineHeight * i;
      ctx.fillText(line, size.width / 2, height);
    });

  // 区切り線
  ctx.beginPath();
  ctx.strokeStyle = dividerLineStyle.color;
  ctx.lineWidth = dividerLineStyle.lineWidth;
  ctx.setLineDash([size.width * 0.01, size.width * 0.006]);
  ctx.moveTo(canvasStyle.padding.horizontal, titleBaseLine + canvasStyle.padding.betweenTitleAndBody / 2);
  ctx.lineTo(size.width - canvasStyle.padding.horizontal, titleBaseLine + canvasStyle.padding.betweenTitleAndBody / 2);
  ctx.stroke();

  // ボディ描画
  ctx.fillStyle = bodyStyle.color;
  ctx.font = bodyStyle.font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const bodyBaseHeight = titleBaseLine + canvasStyle.padding.betweenTitleAndBody;
  const bodyLines = createWrappedTextlines(body, size.width - canvasStyle.padding.horizontal * 2, ctx);
  bodyLines.forEach((line, i) => {
    const height = bodyBaseHeight + bodyStyle.lineHeight * i;
    ctx.fillText(line, size.width / 2, height);
  });

  return canvas.toBuffer('image/png');
};

const createWrappedTextlines = (text: string, maxWidth: number, context: CanvasRenderingContext2D): string[] => {
  const chars = Array.from(text);
  return chars.reduce(
    (acc: string[], char) => {
      const lastLine = acc[acc.length - 1];
      if (maxWidth > context.measureText(lastLine + char).width) {
        return acc.slice(0, acc.length - 1).concat(lastLine.concat(char));
      } else {
        return acc.concat(char);
      }
    },
    ['']
  );
};
