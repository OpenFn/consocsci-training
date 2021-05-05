upsert(
  'KoboData', // the DB table
  'TableId', // a DB column with a unique constraint OR a CONSTRAINT NAME
  { 
    FormName: dataValue('formName'), 
    FormType: dataValue('formType'), 
    TableId: dataValue('tableId'), 
  },
)
upsert(
  'FarmerSurveys', // the DB table
  'AnswerId', // a DB column with a unique constraint OR a CONSTRAINT NAME
  { 
    AnswerId: dataValue('body._id'), 
    SurveyDate: dataValue('body.today'), 
    Age: dataValue('body.age'), 
    Sex: dataValue('body.sex'), 
    Ethnicity: dataValue('body.ethnicity'), 
    Clan: dataValue('body.clan'), 
    HouseholdSize: dataValue('body.house_size'), 
    DepCosts: state => {
     return dataValue('body.COSTS/dep1')(state)+','+
      dataValue('body.COSTS/dep2')(state)+','+
      dataValue('body.COSTS/dep3')(state)+','+
      dataValue('body.COSTS/dep4')(state)+','+
      dataValue('body.COSTS/dep5')(state); 
  }},
)
