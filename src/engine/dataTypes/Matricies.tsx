import type { Vec4 } from "./Vectors";

export interface mat4{
    r0: Vec4,
    r1: Vec4,
    r2: Vec4,
    r3: Vec4
}

export function mat4xvec4(a: mat4, b:Vec4): Vec4{
    var a00 = a.r0.x;
    var a01 = a.r0.y;
    var a02 = a.r0.z;
    var a03 = a.r0.w;
    var a10 = a.r1.x;
    var a11 = a.r1.y;
    var a12 = a.r1.z;
    var a13 = a.r1.w;
    var a20 = a.r2.x;
    var a21 = a.r2.y;
    var a22 = a.r2.z;
    var a23 = a.r2.w;
    var a30 = a.r3.x;
    var a31 = a.r3.y;
    var a32 = a.r3.z;
    var a33 = a.r3.w;
    var b0 = b.x;
    var b1 = b.y;
    var b2 = b.z;
    var b3 = b.w;
    let out: Vec4 = {
        x: a00*b0 + a01*b1 + a02*b2 + a03*b3,
        y: a10*b0 + a11*b1 + a12*b2 + a13*b3,
        z: a20*b0 + a21*b1 + a22*b2 + a23*b3,
        w: a30*b0 + a31*b1 + a32*b2 + a33*b3
    }
    return out;
}

export function mat4xmat4(a: mat4, b: mat4): mat4{
    var a00 = a.r0.x;
    var a01 = a.r0.y;
    var a02 = a.r0.z;
    var a03 = a.r0.w;
    var a10 = a.r1.x;
    var a11 = a.r1.y;
    var a12 = a.r1.z;
    var a13 = a.r1.w;
    var a20 = a.r2.x;
    var a21 = a.r2.y;
    var a22 = a.r2.z;
    var a23 = a.r2.w;
    var a30 = a.r3.x;
    var a31 = a.r3.y;
    var a32 = a.r3.z;
    var a33 = a.r3.w;
    var b00 = b.r0.x;
    var b01 = b.r0.y;
    var b02 = b.r0.z;
    var b03 = b.r0.w;
    var b10 = b.r1.x;
    var b11 = b.r1.y;
    var b12 = b.r1.z;
    var b13 = b.r1.w;
    var b20 = b.r2.x;
    var b21 = b.r2.y;
    var b22 = b.r2.z;
    var b23 = b.r2.w;
    var b30 = b.r3.x;
    var b31 = b.r3.y;
    var b32 = b.r3.z;
    var b33 = b.r3.w;
    let out: mat4 = {
        r0:{
            x: b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            y: b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            z: b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            w: b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
        },
        r1:{
            x: b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            y: b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            z: b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            w: b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
        },
        r2:{
            x: b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            y: b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            z: b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            w: b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
        },
        r3:{
            x: b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            y: b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            z: b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            w: b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
        },
    }
    return out;
}

    /*
  projection(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  }
*/
/*
  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },

  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
*/