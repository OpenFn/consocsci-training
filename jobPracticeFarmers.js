upsert(
  'KoboDataForms', // the DB table
  'TableId', // a DB column with a unique constraint OR a CONSTRAINT NAME
  { 
    FormName: dataValue('formName'), 
    FormType: dataValue('formType'), 
    tableid: dataValue('tableId'), 
  },
)
upsert(
  'FarmerSurveys', // the DB table
  'AnswerId', // a DB column with a unique constraint OR a CONSTRAINT NAME
  { 
    AnswerId: dataValue('body._id'), 
    KoboDataId: findValue({
      uuid: 'KoboDataId',
      relation: 'KoboDataForms',
      where: { 'tableid':  dataValue('tableId') }
    }),
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
