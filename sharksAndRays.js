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
upsertMany(
  'sharksRays_Attachments',
  'attachmentId', // these repeat group elements have a uid, so we can upsertMany
  {
    answerId: dataValue('body._id'), //FK
    attachmentId: dataValue('body._attachments[*].id'), // TODO: update mapping for each element
    url: dataValue('body._attachments[*].download_url'), // TODO: update mapping for each element
    fileName: dataValue('body._attachments[*].filename'), // TODO: update mapping for each element
  }
);

// upsert('sharksRays_Boat', 'boatId', {
//   // TODO: Show how to make a custom id
//   // boatId: return customId: boat/boat_type + "-" + _id (sample output; "dhow-85252496")
//   answerId: dataValue('body._id'), // child to parent sharksRaysForm table
//   boatType: dataValue('body.boat/boat_type'),
//   targetCatch: dataValue('body.boat/target_catch'),
// });

// // TODO: Demo how we handle repeat groups like `catch_details` where no uid is available
// // for each element ==> we therefore overwrite this data in the DB by...
// // (1) deleting existing records, and (2) inserting many repeat group elements
// sql({
//   query: state =>
//     `DELETE FROM sharksRays_BoatCatchDetails where AnswerId = '${state.data.body._id}'`,
// });

// insertMany(
//   'sharksRays_BoatCatchDetails', // for each "boat/catch_details": [...]
//   {
//     // TODO: SHOW HOW TO MAKE CUSTOM ID; map to boat
//     // boatId: returm customId: boat/boat_type + "-" + _id (sample output; "dhow-85252496")
//     answerId: dataValue('body._id'), // child to parent sharksRaysForm table
//     type: dataValue('body.boat/catch_details/type'),
//     weight: dataValue('body.boat/catch_details/weight'),
//   }
// );
