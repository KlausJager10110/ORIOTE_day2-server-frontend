export function max(a, b) {
    // Check if either a or b is NaN, and return NaN in such cases
    if (isNaN(a) || isNaN(b)) return NaN;
  
    // If a is greater than b, return a
    if (a > b) return a;
  
    // If b is greater than a, return b
    if (b > a) return b;
  
    // If a and b are equal, return a (or b, since they are the same)
    return a;
  }
  