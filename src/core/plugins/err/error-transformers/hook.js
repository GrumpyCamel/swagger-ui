import reduce from "lodash/reduce"
import { transform as NotOfType } from "./transformers/not-of-type"
import { transform as ParameterOneOf } from "./transformers/parameter-oneof"
import { transform as StripInstance } from "./transformers/strip-instance"

const errorTransformers = [
  NotOfType,
  ParameterOneOf,
  StripInstance
]

export default function transformErrors (errors, system) {
  let inputs = {
    jsSpec: system.specSelectors.specJson().toJS()
  }

  let transformedErrors = reduce(errorTransformers, (result, transformer) => {
    try {
      let newlyTransformedErrors = transformer.transform(result, inputs)
      return newlyTransformedErrors.filter(err => !!err) // filter removed errors
    } catch(e) {
      console.error("Transformer error:", e)
      return result
    }
  }, errors)

  return transformedErrors
    .filter(err => !!err) // filter removed errors
    .map(err => {
      if(!err.get("line") && err.get("path")) {
        // TODO: re-resolve line number if we've transformed it away
      }
      return err
    })

}

function toTitleCase(str) {
  return str
    .split("-")
    .map(substr => substr[0].toUpperCase() + substr.slice(1))
    .join("")
}
