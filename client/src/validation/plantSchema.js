import * as yup from 'yup';

// Schéma de validation pour les données de plantes
const plantSchema = yup.object().shape({
  id: yup.string().required('L\'ID est requis'),
  name: yup.string().required('Le nom est requis').min(2, 'Le nom doit avoir au moins 2 caractères'),
  type: yup.string().oneOf(['arbre', 'arbuste'], 'Le type doit être "arbre" ou "arbuste"'),
  tailleMaturite: yup.string().required('La taille à maturité est requise'),
  arrosage: yup.string().required('Les besoins d\'arrosage sont requis'),
  taille: yup.string().required('Les besoins de taille sont requis'),
  ensoleillement: yup.string().required('Les besoins d\'ensoleillement sont requis'),
  pH: yup.string().required('Le pH du sol est requis'),
  typeSol: yup.string().required('Le type de sol est requis'),
  conseil: yup.string().required('Les conseils sont requis'),
  resistance: yup.string().required('La résistance aux maladies est requise'),
  utilisation: yup.string().required('L\'utilisation est requise'),
  multiplication: yup.string().required('La méthode de multiplication est requise'),
  images: yup.array().of(
    yup.object().shape({
      spring: yup.string().optional(),
      summer: yup.string().optional(),
      autumn: yup.string().optional(),
      winter: yup.string().optional(),
      details: yup.string().optional()
    })
  ).optional()
});

export default plantSchema;
