import * as Yup from "yup";

export const createUserValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  services: Yup.array()
    .min(1, "Select at least one service")
    .required("Services are required"),
  termsAccepted: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});

export const editUserValidationSchema = Yup.object().shape({
  services: Yup.array()
    .min(1, "Select at least one service")
    .required("Services are required"),
});
