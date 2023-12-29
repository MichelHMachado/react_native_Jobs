import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    height: "100%",
    padding: 40,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    borderWidth: 2,
    borderColor: "gray",
  },
  Inner: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  AuthButtons: {
    marginTop: 24,
    height: 60,
    width: 150,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
