import * as Yup from 'yup';

export const irrigationLogValidationSchema = Yup.object({
  startDate: Yup.date()
    .required('La fecha de inicio es obligatoria.')
    .typeError('Fecha de inicio inválida.'),
  finishDate: Yup.date()
    .required('La fecha de fin es obligatoria.')
    .typeError('Fecha de fin inválida.')
    .min(Yup.ref('startDate'), 'La fecha de fin debe ser posterior a la de inicio.'),
});