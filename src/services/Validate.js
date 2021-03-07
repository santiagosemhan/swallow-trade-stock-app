import validation from './Validator'

export default function validate(fieldName, value) {

  let constraints = {
    email: {
      presence: true,
      format: {
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: '^Email no válido.',
      }
    },
    startDate: {
      presence: true,
      format: {
        pattern: /^([1-9]|0[1-9]|[12][0-9]|3[01])[/.]([1-9]|0[1-9]|1[012])[/.](19|20)\d\d$/,
        flags: "i",
        message: "^Ingrese una fecha válida."
      },
    },
    login: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese un DNI o email válido.',
      },
    },
    password: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese su contraseña.',
      },
      length: {
        minimum: 8,
        message: '^La contraseña debe contener al menos 8 dígitos.',
      },
      format: {
        pattern: /[a-zA-Z0-9]+/,
        flags: "i",
        message: "^Contraseña no válida."
      },
    },
    oldPassword: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese su contraseña actual.',
      },
    },
    category: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese una categoría válida.',
      },
      format: {
        pattern: /[a-zA-Z0-9]+/,
        message: "^Ingrese una categoría válida."
      },
    },
    thickness: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese un espesor válido.',
      },
    },
    width: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese un ancho válido.',
      },
    },
    height: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese un largo válido.',
      },
    },
    quality: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese una calidad válida.',
      },
    },
    stockVolume: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese un volumen de stock válido.',
      },
    },
    species: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese una especie válida.',
      },
    },
    stockQuantity: {
      presence: {
        allowEmpty: false,
        message: '^Ingrese una cantidad de stock válida.',
      },
    },
    comments: {
      presence: {
        allowEmpty: true,
        message: '^Ingrese un comentario válido.',
      },
    },
  };

  var formValues = {}
  formValues[fieldName] = value

  var formFields = {}
  formFields[fieldName] = constraints[fieldName]


  const result = validation(formValues, formFields)

  if (result) {
    return result[fieldName][0]
  }
  return null
}