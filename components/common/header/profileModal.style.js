import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  Container: {
    maxWidth: 600,
    maxHeight: 600,
    padding: "80px",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    border: "2px solid black",
  },
  Inner: {
    gap: "16px",
  },
  btnImg: (dimension) => ({
    width: dimension,
    height: dimension,
    borderRadius: SIZES.small / 1.25,
  }),
});

export default styles;
