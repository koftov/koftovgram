export default function validateCreatePost(values) {
  let errors = {};
  // Title Errors
  if (!values.title) {
    errors.title = "A title is required.";
  }

  return errors;
}
