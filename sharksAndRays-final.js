upsert('kobodata', 'form_id', {
  // columnName: dataValue('koboQuestion'),
  form_id: dataValue('body._xform_id_string'), //set PK
  form_name: dataValue('formName'),
  form_type: dataValue('formType'),
  submission_date: dataValue('body._submission_time'),
  // TODO: here can we show then how to do data cleaning and use alterState(...)
  latitude: state => state.data.body['gps'].split(' ')[0], // parse "_geolocation": [ 11.178402, 31.8446]" // ADD DATA CLEANING
  longitude: state => state.data.body['gps'].split(' ')[1],
});

upsert('sharksrays_form', 'answer_id', {
  form_id: dataValue('_xform_id_string'), //FK
  answer_id: dataValue('body._id'), //PK
  country: dataValue('body.country'),
  survey_type: dataValue('body.survey'),
});

// TODO: show how to implement each() for each _attachments[...] element in this repeat group
upsertMany(
  'sharksrays_attachments',
  'attachment_id', // these repeat group elements have a uid, so we can upsertMany
  state =>
    state.data.body._attachments.map(a => ({
      answer_id: state.data.body._id, //FK
      attachment_id: a.id, // TODO: update mapping for each element
      url: a.download_url, // TODO: update mapping for each element
      file_name: a.filename, // TODO: update mapping for each element
    }))
);

upsert('sharksrays_boat', 'boat_id', {
  // TODO: Show how to make a custom id
  boat_id: state => state.data.body['boat/boat_type'] + '-' + state.data.body['_id'],
  answer_id: dataValue('body._id'), // child to parent sharksRaysForm table
  boat_type: dataValue('body.boat/boat_type'),
  target_catch: dataValue('body.boat/target_catch'),
});

// TODO: Demo how we handle repeat groups like `catch_details` where no uid is available
// for each element ==> we therefore overwrite this data in the DB by...
// (1) deleting existing records, and (2) inserting many repeat group elements
sql(state => `DELETE FROM sharksrays_boatcatchdetails where answer_id = '${state.data.body._id}'`);

each(
  merge(dataPath('body.boat[*]'), fields(field('answerId', dataValue('body._id')))),
  insertMany('sharksrays_boatcatchdetails', state => {
    const catch_details = state.data['boat/catch_details'] || [];
    return catch_details.map((cd, i) => ({
      // TODO: SHOW HOW TO MAKE CUSTOM ID; map to boat
      boat_id: cd['boat/boat_type'] + '-' + state.data.answerId,
      answer_id: state.data.answerId, // child to parent sharksRaysForm table
      type: cd['boat/catch_details/type'],
      weight: cd['boat/catch_details/weight'],
    }));
  })
);
