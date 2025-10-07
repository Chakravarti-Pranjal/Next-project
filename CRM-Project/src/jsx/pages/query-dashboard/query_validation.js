import * as yup from "yup";

export const queryAddValidation = yup.object().shape({
  BusinessTypeId: yup.string().required("Please select business type"),
  // Priority: yup.string().required("Please select priority"),
  ServiceId: yup.string().required("Please select agent"),
});
export const updatePreferenceValidation = yup.object().shape({
  SetPreference: yup.string().required("Please select priority type"),
  Preview: yup.string().required("Please select preview"),
  TravelInfo: yup.string().required("Please select travel info"),
  Email: yup.string().required("Please select email"),
  Preferences: yup.object().shape({
    QueryTypeId: yup.string().required("Please select query type"), // Correct way to validate nested object field
  }),
});
export const reminderValidation = yup.object().shape({
  RemarkJson: yup.object().shape({
    NoteTypeName: yup.string().required("Note Type is required"),
    ReminderDate: yup.string().required("Reminder Date is required"),
    ReminderTime: yup.string().required("Reminder Time is required"),
  }),
});
export const hotelValidation = yup.array().of(
  yup.object().shape({
    Destination: yup.string().required("Destination is required"),
    // Add other fields if needed
  })
);
export const TourDetailsValidation = yup.array().of(
  yup.object().shape({
    PaxSlab: yup.string().required("PaxSlab is required"),
    // Add other fields if needed
  })
);

export const TransfertypeValidation = yup
  .array()
  .of(
    yup.object().shape({
      TransferType: yup.string().nullable(), // Optional per item
      ServiceId: yup.string().nullable(), // Optional per item
    })
  )
  .test(
    "program-type-and-service",
    "Program Type and Program are required",
    function (value) {
      const hasTransferType = Array.isArray(value)
        ? value.some(
            (item) =>
              item &&
              typeof item.TransferType === "string" &&
              item.TransferType.trim() !== ""
          )
        : false;

      const hasServiceId = Array.isArray(value)
        ? value.some(
            (item) =>
              item &&
              typeof item.ServiceId === "string" &&
              item.ServiceId.trim() !== ""
          )
        : false;

      // ✅ If at least one of each exists, pass
      if (hasTransferType && hasServiceId) return true;

      // ❌ If both missing, return a single combined error
      if (!hasTransferType && !hasServiceId) {
        return this.createError({
          message: "At least one Program Type and one Program are required",
        });
      }

      if (!hasTransferType) {
        return this.createError({
          message: "At least one Program Type is required",
        });
      }

      if (!hasServiceId) {
        return this.createError({
          message: "At least one Program is required",
        });
      }

      return true; // Just in case
    }
  );
