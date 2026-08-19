const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
  red: "\x1b[31m",
} as const;

export const log = (message: string, color: string = colors.green) => {
  console.log(`${color}${message}${colors.reset}`);
};
