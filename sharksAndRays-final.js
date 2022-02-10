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

upsertMany(
  'sharksrays_attachments',
  'attachment_id', // these repeat group elements have a uid, so we can upsertMany
  state =>
    state.data.body._attachments.map(a => ({
      answer_id: state.data.body._id, //FK
      attachment_id: a.id, 
      url: a.download_url, 
      file_name: a.filename, 
    }))
);

upsert('sharksrays_boat', 'boat_id', {
  boat_id: state => state.data.body['boat/boat_type'] + '-' + state.data.body['_id'],
  answer_id: dataValue('body._id'), // child to parent sharksRaysForm table
  boat_type: dataValue('body.boat/boat_type'),
  target_catch: dataValue('body.boat/target_catch'),
});


sql(state => `DELETE FROM sharksrays_boatcatchdetails where answer_id = '${state.data.body._id}'`);

each(
  merge(dataPath('body.boat[*]'), fields(field('answerId', dataValue('body._id')))),
  insertMany('sharksrays_boatcatchdetails', state => {
    const catch_details = state.data['boat/catch_details'] || [];
    return catch_details.map((cd, i) => ({
      boat_id: cd['boat/boat_type'] + '-' + state.data.answerId,
      answer_id: state.data.answerId, // child to parent sharksRaysForm table
      type: cd['boat/catch_details/type'],
      weight: cd['boat/catch_details/weight'],
    }));
  })
);
