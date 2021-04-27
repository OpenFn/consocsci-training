upsert('kobodata', 'form_id', {
  // columnName: dataValue('koboQuestion'),
  form_id: dataValue('formId'), //set PK
  form_name: dataValue('formName'),
  form_type: dataValue('formType'),
  submission_date: dataValue('body._submission_time'),
  // TODO: here can we show then how to do data cleaning and use alterState(...)
  // latitude: dataValue('_geolocation'), // parse "_geolocation": [ 11.178402, 31.8446]" // ADD DATA CLEANING
  // longitude: dataValue('_geolocation'), // parse "_geolocation": [ 11.178402, 31.8446]"
});

upsert('sharksrays_form', 'answer_id', {
  form_id: dataValue('formId'), //FK
  answer_id: dataValue('body._id'), //PK
  country: dataValue('body.country'),
  survey_type: dataValue('body.survey'),
});

// TODO: show how to implement each() for each _attachments[...] element in this repeat group
// upsertMany(
//   'sharksrays_attachments',
//   'attachment_id', // these repeat group elements have a uid, so we can upsertMany
//   state => [1, 2, 3] // some function that maps "_attachments" -> answer_id, attachment_id, url, file_name
// );

upsert('sharksrays_boat', 'boat_id', {
  // TODO: Show how to make a custom id
  // boat_id: with 'boat/boat_type' and '_id' (sample output; "dhow-85252496")
  answer_id: dataValue('body._id'), // child to parent sharksRaysForm table
  boat_type: dataValue('body.boat/boat_type'),
  target_catch: dataValue('body.boat/target_catch'),
});

// TODO: Demo how we handle repeat groups like `catch_details` where no uid is available
// for each element ==> we therefore overwrite this data in the DB by...
// (1) deleting existing records, and (2) inserting many repeat group elements
// sql(state => `DELETE FROM sharksrays_boatcatchdetails where answer_id = '${state.data.body._id}'`);

// insertMany(
//   'sharksRays_boatcatchdetails',
//   state => [1, 2, 3] // some function that maps "boat/catch_details" -> boat_id, answer_id, type, weight
// );
