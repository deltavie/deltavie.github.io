export const defaultFS = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
      if(gl_FragColor.w <= 0.5) discard;
    }
  `;
// texture transparency hack, can't have semi-transparent but can have fully transparent
// need to find a solution for semi transparency