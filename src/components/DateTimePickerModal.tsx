import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DateTimePicker from "react-datetime-picker";
import { irrigationLogValidationSchema } from "../validation/validationSchemas";
import { setFormData } from "../redux/waterShiftSlice";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

interface DateTimePickerModalProps {
  type: "irrigationLog" | "waterShift";
  onCancel: () => void;
  onSubmit: (values: { startDate: string; finishDate: string }) => void;
}

const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({ type, onCancel, onSubmit }) => {
  const dispatch = useDispatch();
  const selectedQuadrant = useSelector((state: RootState) => state.waterShift.selectedQuadrant);
  const formData = useSelector((state: RootState) => state.waterShift.formData);

  const isIrrigationLog = type === "irrigationLog";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 modal z-1">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] text-black">
  <h2 className="text-lg font-bold mb-4">
    {formData.editMode
      ? (isIrrigationLog ? "Editar Registro de Riego" : "Editar Turno de Riego")
      : (isIrrigationLog ? "Crear Registro de Riego" : "Crear Turno de Riego")}
  </h2>
        {isIrrigationLog && (
          <p className="text-sm mb-2">
            Cuartel: <span className="font-semibold">{selectedQuadrant}</span>
          </p>
        )}

        <Formik
          initialValues={{
            startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
            finishDate: formData.finishDate ? new Date(formData.finishDate) : new Date(),
          }}
          validationSchema={irrigationLogValidationSchema}
          onSubmit={(values) => {
            onSubmit({
              startDate: values.startDate.toISOString(),
              finishDate: values.finishDate.toISOString(),
            });
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="flex flex-col gap-3">
              <label className="text-sm font-medium">Inicio:</label>
              <DateTimePicker
                onChange={(value) => {
                  setFieldValue("startDate", value);
                  dispatch(setFormData({ ...formData, startDate: value ? value.toISOString() : "" }));
                }}
                value={values.startDate}
                format="MM-dd HH:mm"
                className="border p-2 rounded"
              />
              <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm" />

              <label className="text-sm font-medium">Fin:</label>
              <DateTimePicker
                onChange={(value) => {
                  setFieldValue("finishDate", value);
                  dispatch(setFormData({ ...formData, finishDate: value ? value.toISOString() : "" }));
                }}
                value={values.finishDate}
                format="MM-dd HH:mm"
                className="border p-2 rounded"
              />
              <ErrorMessage name="finishDate" component="div" className="text-red-500 text-sm" />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
                >
                  Guardar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DateTimePickerModal;