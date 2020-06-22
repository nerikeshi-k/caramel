import { CanvasRenderingContext2D, createCanvas } from 'canvas';

interface Option {
  size: {
    width: number;
    height: number;
  };
  canvasStyle: {
    backgroundColor: string;
    border: {
      color: string;
      width: number;
    };
    padding: {
      horizontal: number;
      betweenTitleAndBody: number;
    };
  };
  siteNameStyle: {
    font: string;
    lineHeight: number;
    color: string;
    backgroundColor: string;
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
  };
  dividerLineStyle: {
    lineWidth: number;
    color: string;
  };
  buttonStyle: {
    w: number;
    h: number;
    radius: number;
    backgroundColor: string;
    textColor: string;
    font: string;
  };
}

const DEFAULT_OPTION: Option = {
  size: {
    width: 1200,
    height: 630,
  },
  canvasStyle: {
    backgroundColor: '#ffffff',
    border: {
      color: '#333',
      width: 4,
    },
    padding: {
      horizontal: 40,
      betweenTitleAndBody: 40,
    },
  },
  siteNameStyle: {
    font: '28px "Noto Sans CJK JP"',
    lineHeight: 60,
    color: '#fff',
    backgroundColor: '#333',
  },
  titleStyle: {
    font: 'bold 70px "Noto Sans CJK JP"',
    lineHeight: 80,
    color: '#333',
  },
  bodyStyle: {
    font: '30px "Noto Sans CJK JP"',
    lineHeight: 38,
    color: '#333',
  },
  dividerLineStyle: {
    lineWidth: 4,
    color: '#333',
  },
  buttonStyle: {
    w: 440,
    h: 100,
    radius: 5,
    backgroundColor: '#294470',
    textColor: '#fff',
    font: 'bold 40px "Noto Sans CJK JP"',
  },
};

export const renderImage = (title: string, body: string, option?: Partial<Option>) => {
  const {
    size = DEFAULT_OPTION.size,
    canvasStyle = DEFAULT_OPTION.canvasStyle,
    siteNameStyle = DEFAULT_OPTION.siteNameStyle,
    titleStyle = DEFAULT_OPTION.titleStyle,
    bodyStyle = DEFAULT_OPTION.bodyStyle,
    dividerLineStyle = DEFAULT_OPTION.dividerLineStyle,
    buttonStyle = DEFAULT_OPTION.buttonStyle,
  } = option || DEFAULT_OPTION;

  const canvas = createCanvas(size.width, size.height);
  const ctx = canvas.getContext('2d');

  // 背景＆枠描画
  ctx.fillStyle = canvasStyle.border.color;
  ctx.fillRect(0, 0, size.width, size.height);

  ctx.fillStyle = canvasStyle.backgroundColor;
  ctx.fillRect(
    canvasStyle.border.width,
    canvasStyle.border.width,
    size.width - canvasStyle.border.width * 2,
    size.height - canvasStyle.border.width * 2
  );

  // サイト名
  ctx.fillStyle = siteNameStyle.backgroundColor;
  ctx.fillRect(0, 0, size.width, siteNameStyle.lineHeight);

  ctx.fillStyle = siteNameStyle.color;
  ctx.font = siteNameStyle.font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('お題ガチャ', size.width * 0.02, siteNameStyle.lineHeight / 2);

  // タイトル描画
  ctx.fillStyle = titleStyle.color;
  ctx.font = titleStyle.font;
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'center';
  const titleBaseLine = size.height * 0.45;
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

  // ボタン描画
  {
    ctx.beginPath();
    ctx.fillStyle = buttonStyle.backgroundColor;
    ctx.setLineDash([]);
    const yBaseline = size.height * 0.8;
    const { w, h } = buttonStyle;
    const x = size.width / 2 - w / 2;
    const y = yBaseline - h / 2;
    const r = buttonStyle.radius;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.fill();

    ctx.fillStyle = buttonStyle.textColor;
    ctx.font = buttonStyle.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ガチャを回す', size.width / 2, yBaseline);
  }
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
