const device = {
  xs: "0px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1450px",
  xxxl: "1600px",
};

const layout = {
  up: {
    xs: `(min-width: ${device.xs})`,
    sm: `(min-width: ${device.sm})`,
    md: `(min-width: ${device.md})`,
    lg: `(min-width: ${device.lg})`,
    xl: `(min-width: ${device.xl})`,
    xxl: `(min-width: ${device.xxl})`,
    xxxl: `(min-width: ${device.xxxl})`,
  },
  down: {
    xs: `(max-width: ${device.xs})`,
    sm: `(max-width: ${device.sm})`,
    md: `(max-width: ${device.md})`,
    lg: `(max-width: ${device.lg})`,
    xl: `(max-width: ${device.xl})`,
    xxl: `(max-width: ${device.xxl})`,
    xxxl: `(max-width: ${device.xxxl})`,
  },
};

export default layout;
