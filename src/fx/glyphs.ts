/**
 * The small objects that drift behind the hero and the contact section.
 * Each featured project has its own set, drawn here as original vector shapes
 * (no images, no emoji) in a unit box from -0.5 to 0.5. Solid glyphs get the
 * site's chunky lower edge; Physio-AI's are line drawings, like a pose overlay.
 */
export type AmbientSet = 'pathlife' | 'sumlume' | 'physio-ai' | 'pawlife' | 'mix';
/** A colour for light backgrounds and one for dark backgrounds. */
type Tone = readonly [light: string, dark: string];
type Ctx = CanvasRenderingContext2D;

interface DrawOptions {
  colour: string;
  accent: string;
  ink: string;
  value: number;
}
export interface Glyph {
  id: string;
  /** Line drawing rather than a solid tile. */
  line?: boolean;
  /** Fixed colours for this glyph, instead of the set's palette. */
  tones?: readonly Tone[];
  draw: (context: Ctx, options: DrawOptions) => void;
}

const same = (colour: string): Tone => [colour, colour];
const tau = Math.PI * 2;

/** Draws a solid shape with a darker edge underneath, like the site's tiles. */
function chunky(context: Ctx, { colour, ink }: DrawOptions, body: (context: Ctx) => void) {
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.save();
  context.translate(0, 0.075);
  context.fillStyle = colour;
  context.strokeStyle = colour;
  body(context);
  context.globalAlpha = 0.4;
  context.fillStyle = ink;
  context.strokeStyle = ink;
  body(context);
  context.restore();
  context.fillStyle = colour;
  context.strokeStyle = colour;
  body(context);
}
function detail(context: Ctx, ink: string, alpha = 0.55) {
  context.globalAlpha = alpha;
  context.fillStyle = ink;
  context.strokeStyle = ink;
  context.lineCap = 'round';
  context.lineJoin = 'round';
}
const circle = (context: Ctx, x: number, y: number, r: number) => {
  context.beginPath();
  context.arc(x, y, r, 0, tau);
  context.fill();
};
function heartPath(context: Ctx) {
  context.beginPath();
  context.moveTo(0, 0.37);
  context.bezierCurveTo(-0.66, -0.04, -0.36, -0.52, 0, -0.2);
  context.bezierCurveTo(0.36, -0.52, 0.66, -0.04, 0, 0.37);
  context.fill();
}

const heart: Glyph = {
  id: 'heart',
  tones: [same('#ff6f91')],
  draw: (context, options) => {
    chunky(context, options, heartPath);
    detail(context, '#ffffff', 0.5);
    circle(context, -0.2, -0.14, 0.06);
  },
};

const coin: Glyph = {
  id: 'coin',
  tones: [same('#ffcf5a')],
  draw: (context, options) => {
    chunky(context, options, (c) => circle(c, 0, 0, 0.4));
    detail(context, options.ink, 0.4);
    context.lineWidth = 0.05;
    context.beginPath();
    context.arc(0, 0, 0.27, 0, tau);
    context.stroke();
    context.lineWidth = 0.07;
    context.beginPath();
    context.moveTo(0, -0.12);
    context.lineTo(0, 0.12);
    context.stroke();
  },
};

const star: Glyph = {
  id: 'star',
  tones: [same('#ffcf5a'), same('#b79bff')],
  draw: (context, options) => {
    chunky(context, options, (c) => {
      c.lineWidth = 0.1;
      c.beginPath();
      for (let point = 0; point < 10; point += 1) {
        const radius = point % 2 ? 0.19 : 0.42;
        const angle = (point / 10) * tau - Math.PI / 2;
        c.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      c.closePath();
      c.fill();
      c.stroke();
    });
  },
};

const house: Glyph = {
  id: 'house',
  draw: (context, options) => {
    chunky(context, options, (c) => {
      c.lineWidth = 0.08;
      c.beginPath();
      c.moveTo(-0.44, -0.04);
      c.lineTo(0, -0.4);
      c.lineTo(0.44, -0.04);
      c.lineTo(0.32, -0.04);
      c.lineTo(0.32, 0.36);
      c.lineTo(-0.32, 0.36);
      c.lineTo(-0.32, -0.04);
      c.closePath();
      c.fill();
      c.stroke();
    });
    detail(context, options.ink, 0.5);
    context.beginPath();
    context.roundRect(-0.09, 0.1, 0.18, 0.3, [0.07, 0.07, 0, 0]);
    context.fill();
  },
};

const cap: Glyph = {
  id: 'cap',
  draw: (context, options) => {
    chunky(context, options, (c) => {
      c.lineWidth = 0.06;
      c.beginPath();
      c.moveTo(-0.25, 0);
      c.lineTo(-0.25, 0.24);
      c.quadraticCurveTo(0, 0.38, 0.25, 0.24);
      c.lineTo(0.25, 0);
      c.closePath();
      c.fill();
      c.beginPath();
      c.moveTo(0, -0.34);
      c.lineTo(0.46, -0.12);
      c.lineTo(0, 0.1);
      c.lineTo(-0.46, -0.12);
      c.closePath();
      c.fill();
      c.stroke();
    });
    detail(context, options.ink, 0.5);
    context.lineWidth = 0.05;
    context.beginPath();
    context.moveTo(0, -0.12);
    context.lineTo(0.38, -0.04);
    context.lineTo(0.38, 0.2);
    context.stroke();
    circle(context, 0.38, 0.24, 0.06);
  },
};

const briefcase: Glyph = {
  id: 'briefcase',
  tones: [same('#c98a5a'), same('#5aa9f5')],
  draw: (context, options) => {
    chunky(context, options, (c) => {
      c.lineWidth = 0.08;
      c.beginPath();
      c.roundRect(-0.16, -0.36, 0.32, 0.24, 0.07);
      c.stroke();
      c.beginPath();
      c.roundRect(-0.42, -0.2, 0.84, 0.56, 0.1);
      c.fill();
    });
    detail(context, options.ink, 0.45);
    context.lineWidth = 0.05;
    context.beginPath();
    context.moveTo(-0.42, 0.04);
    context.lineTo(0.42, 0.04);
    context.stroke();
    context.beginPath();
    context.roundRect(-0.07, -0.03, 0.14, 0.14, 0.03);
    context.fill();
  },
};

const key: Glyph = {
  id: 'key',
  tones: [same('#ffcf5a'), same('#5aa9f5')],
  draw: (context, options) => {
    chunky(context, options, (c) => {
      circle(c, -0.24, 0, 0.21);
      c.beginPath();
      c.roundRect(-0.08, -0.065, 0.54, 0.13, 0.06);
      c.fill();
      c.beginPath();
      c.roundRect(0.2, 0, 0.09, 0.2, 0.03);
      c.fill();
      c.beginPath();
      c.roundRect(0.35, 0, 0.09, 0.16, 0.03);
      c.fill();
    });
    detail(context, options.ink, 0.5);
    circle(context, -0.27, 0, 0.075);
  },
};

const numberTile: Glyph = {
  id: 'tile',
  draw: (context, options) => {
    chunky(context, options, (c) => {
      c.beginPath();
      c.roundRect(-0.4, -0.42, 0.8, 0.8, 0.2);
      c.fill();
    });
    detail(context, options.ink, 0.85);
    context.font = '700 0.5px "Bricolage Grotesque", system-ui, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(String(options.value), 0, 0);
  },
};

const paw: Glyph = {
  id: 'paw',
  tones: [same('#c98a5a'), same('#f2a65a'), ['#2f7d5b', '#6fcf9f']],
  draw: (context, options) => {
    chunky(context, options, (c) => {
      c.beginPath();
      c.ellipse(0, 0.16, 0.27, 0.21, 0, 0, tau);
      c.fill();
      circle(c, -0.31, -0.06, 0.1);
      circle(c, -0.12, -0.27, 0.115);
      circle(c, 0.12, -0.27, 0.115);
      circle(c, 0.31, -0.06, 0.1);
    });
  },
};

const bone: Glyph = {
  id: 'bone',
  tones: [['#f6dfb4', '#fff0d0']],
  draw: (context, options) => {
    context.rotate(-0.5);
    chunky(context, options, (c) => {
      c.beginPath();
      c.roundRect(-0.28, -0.085, 0.56, 0.17, 0.04);
      c.fill();
      for (const x of [-0.3, 0.3]) for (const y of [-0.1, 0.1]) circle(c, x, y, 0.125);
    });
  },
};

const fish: Glyph = {
  id: 'fish',
  tones: [same('#6fb8e8'), same('#f2a65a')],
  draw: (context, options) => {
    chunky(context, options, (c) => {
      c.lineWidth = 0.06;
      c.beginPath();
      c.moveTo(0.14, 0);
      c.lineTo(0.44, -0.22);
      c.lineTo(0.44, 0.22);
      c.closePath();
      c.fill();
      c.stroke();
      c.beginPath();
      c.ellipse(-0.08, 0, 0.34, 0.22, 0, 0, tau);
      c.fill();
    });
    detail(context, options.ink, 0.6);
    circle(context, -0.24, -0.05, 0.045);
    context.globalAlpha = 0.3;
    context.lineWidth = 0.045;
    context.beginPath();
    context.arc(-0.2, 0, 0.2, -0.7, 0.7);
    context.stroke();
  },
};

const ball: Glyph = {
  id: 'ball',
  tones: [same('#e9d24f'), same('#ee7f6b')],
  draw: (context, options) => {
    chunky(context, options, (c) => circle(c, 0, 0, 0.38));
    detail(context, '#ffffff', 0.7);
    context.lineWidth = 0.055;
    context.beginPath();
    context.arc(-0.5, 0, 0.36, -0.75, 0.75);
    context.stroke();
    context.beginPath();
    context.arc(0.5, 0, 0.36, Math.PI - 0.75, Math.PI + 0.75);
    context.stroke();
  },
};

const bowl: Glyph = {
  id: 'bowl',
  tones: [same('#6fb8e8'), ['#2f7d5b', '#6fcf9f']],
  draw: (context, options) => {
    detail(context, '#b9743f', 1);
    circle(context, -0.14, -0.12, 0.1);
    circle(context, 0.04, -0.17, 0.11);
    circle(context, 0.2, -0.11, 0.09);
    context.globalAlpha = 1;
    chunky(context, options, (c) => {
      c.lineWidth = 0.08;
      c.beginPath();
      c.moveTo(-0.4, -0.06);
      c.lineTo(0.4, -0.06);
      c.lineTo(0.28, 0.28);
      c.lineTo(-0.28, 0.28);
      c.closePath();
      c.fill();
      c.stroke();
    });
    detail(context, options.ink, 0.3);
    context.lineWidth = 0.05;
    context.beginPath();
    context.moveTo(-0.3, 0.06);
    context.lineTo(0.3, 0.06);
    context.stroke();
  },
};

/** Pose-overlay drawings: lines in the set colour, joints in the accent. */
function overlay(
  context: Ctx,
  { colour, accent }: DrawOptions,
  lines: number[][],
  joints: number[][],
) {
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = 0.08;
  context.strokeStyle = colour;
  for (const line of lines) {
    context.beginPath();
    for (let point = 0; point < line.length; point += 2)
      context.lineTo(line[point], line[point + 1]);
    context.stroke();
  }
  context.fillStyle = accent;
  for (const [x, y, r = 0.075] of joints) circle(context, x, y, r);
}

const limb: Glyph = {
  id: 'limb',
  line: true,
  draw: (context, options) =>
    overlay(
      context,
      options,
      [[-0.28, -0.36, 0.16, -0.04, -0.14, 0.38]],
      [
        [-0.28, -0.36],
        [0.16, -0.04],
        [-0.14, 0.38],
      ],
    ),
};

const figure: Glyph = {
  id: 'figure',
  line: true,
  draw: (context, options) => {
    overlay(
      context,
      options,
      [
        [0, -0.24, 0, 0.06],
        [-0.3, -0.08, -0.16, -0.2, 0.16, -0.2, 0.3, -0.08],
        [0, 0.06, -0.2, 0.22, -0.12, 0.44],
        [0, 0.06, 0.2, 0.22, 0.14, 0.44],
      ],
      [
        [-0.3, -0.08, 0.055],
        [0.3, -0.08, 0.055],
        [-0.16, -0.2, 0.055],
        [0.16, -0.2, 0.055],
        [0, 0.06, 0.06],
        [-0.2, 0.22, 0.055],
        [0.2, 0.22, 0.055],
        [-0.12, 0.44, 0.055],
        [0.14, 0.44, 0.055],
      ],
    );
    context.strokeStyle = options.colour;
    context.beginPath();
    context.arc(0, -0.36, 0.1, 0, tau);
    context.stroke();
  },
};

const angle: Glyph = {
  id: 'angle',
  line: true,
  draw: (context, options) => {
    overlay(context, options, [[0.38, 0.26, -0.3, 0.26, 0.08, -0.36]], [[-0.3, 0.26, 0.085]]);
    context.lineWidth = 0.05;
    context.strokeStyle = options.accent;
    context.beginPath();
    context.arc(-0.3, 0.26, 0.3, -1.02, 0);
    context.stroke();
  },
};

const box: Glyph = {
  id: 'box',
  line: true,
  draw: (context, options) => {
    const edge = 0.38;
    const arm = 0.17;
    const lines: number[][] = [];
    for (const x of [-1, 1])
      for (const y of [-1, 1])
        lines.push([x * edge, y * (edge - arm), x * edge, y * edge, x * (edge - arm), y * edge]);
    overlay(context, options, lines, [[0, 0, 0.08]]);
  },
};

const target: Glyph = {
  id: 'target',
  line: true,
  draw: (context, options) => {
    overlay(context, options, [], [[0, 0, 0.1]]);
    context.lineWidth = 0.05;
    context.strokeStyle = options.colour;
    context.setLineDash([0.16, 0.12]);
    context.beginPath();
    context.arc(0, 0, 0.3, 0, tau);
    context.stroke();
    context.setLineDash([]);
  },
};

interface SetDefinition {
  glyphs: readonly Glyph[];
  tones: readonly Tone[];
  /** Joint colour for line drawings. */
  accent: Tone;
}
const none: Tone = same('#000000');

export const objectSets: Record<Exclude<AmbientSet, 'mix'>, SetDefinition> = {
  // Life-journey objects, in the sky blue, blossom, gold and green of the game.
  pathlife: {
    glyphs: [heart, coin, house, cap, briefcase, star, key],
    tones: [same('#5aa9f5'), same('#ff8fb3'), same('#2fbf8a'), same('#b79bff'), same('#ffcf5a')],
    accent: none,
  },
  sumlume: {
    glyphs: [numberTile],
    tones: [same('#ffd465'), same('#9fe8c9'), same('#bfcbff'), same('#ffbcd3'), same('#e3ceff')],
    accent: none,
  },
  // Pose-tracking marks: amber and teal lines with coral joints, like the app's overlay.
  'physio-ai': {
    glyphs: [figure, limb, angle, box, target, limb, figure],
    tones: [
      ['#0b8f7a', '#7fe3c8'],
      ['#d68a00', '#ffd465'],
      ['#0b8f7a', '#7fe3c8'],
    ],
    accent: ['#e0506e', '#ff9db0'],
  },
  pawlife: {
    glyphs: [paw, bone, fish, ball, bowl, heart, paw],
    tones: [same('#f2a65a'), same('#c98a5a')],
    accent: none,
  },
};
const order = ['pathlife', 'sumlume', 'physio-ai', 'pawlife'] as const;

export interface Picked {
  glyph: Glyph;
  tone: Tone;
  accent: Tone;
  value: number;
}

/** Choose a glyph and colour from a set. `mix` draws from all four sets in turn. */
export function pick(set: AmbientSet, index: number): Picked {
  const definition = objectSets[set === 'mix' ? order[index % order.length] : set];
  const turn = set === 'mix' ? Math.floor(index / order.length) : index;
  const glyph = definition.glyphs[turn % definition.glyphs.length];
  const tones = glyph.tones ?? definition.tones;
  return {
    glyph,
    tone: tones[Math.floor(Math.random() * tones.length)],
    accent: definition.accent,
    value: 1 + Math.floor(Math.random() * 9),
  };
}

const sprites = new Map<string, HTMLCanvasElement>();
const spriteSize = 160;
/** How much of the sprite is margin around the unit box, so edges and strokes fit. */
export const spriteSpan = 1.4;

/** An opaque, cached drawing of one glyph in one colour. The caller sets the alpha. */
export function sprite(picked: Picked, dark: boolean) {
  const colour = picked.tone[dark ? 1 : 0];
  const accent = picked.accent[dark ? 1 : 0];
  const value = picked.glyph.id === 'tile' ? picked.value : 0;
  const id = `${picked.glyph.id}|${colour}|${accent}|${value}|${dark}`;
  let canvas = sprites.get(id);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = spriteSize;
    canvas.height = spriteSize;
    const context = canvas.getContext('2d')!;
    context.translate(spriteSize / 2, spriteSize / 2);
    context.scale(spriteSize / spriteSpan, spriteSize / spriteSpan);
    picked.glyph.draw(context, { colour, accent, ink: dark ? '#0d0b24' : '#14113a', value });
    sprites.set(id, canvas);
  }
  return canvas;
}

/** Drop cached drawings, for example once the web font has loaded. */
export function clearSprites() {
  sprites.clear();
}
