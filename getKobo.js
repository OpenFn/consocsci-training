// == Job to be used for fetching data from Kobo from ConSocSci Training acct on repeated, timer basis  ==//
// This can be run on-demand at any time by clicking "run" //
alterState(state => {
  // Set a manual cursor if you'd like to only fetch data after this date.
  state.data = {
    surveys: [
      // /====***FOR ADMINS TO UPDATE & CHANGE FORMS ***=====================//
      // ** Specify new forms to fetch here from the `wcs_training` account **//
      // { id: 'aMpW7wwRBRbtCfidtK2rRn', tag: 'bns_survey', name: 'Form Project Name', owner: 'wcs'},
      /*{
        id: 'adiNTJXFtpKEDGGZFMUtgQ', //unique Id from form URL
        type: 'sharks_rays', //survey type/ template/ form group
        name: 'Sharks and Rays Demo', //form name to display in the database
        owner: 'openfn', //Kobo form Owner
      },*/
      {
        id: 'aDgPJqN4SAYohZ4ZueEeYU', //unique Id from form URL
        type: 'arcadia', //survey type/ template/ form group
        name: 'Arcadia Data Collection Site Survey', //form name to display in the database
        owner: 'openfn', //Kobo form Owner
      },
      
      // =================================================================//
    ].map(survey => ({
      formId: survey.id,
      type: survey.type,
      name: survey.name,
      owner: survey.owner,
      url: `https://kf.kobotoolbox.org/api/v2/assets/${survey.id}/data/?format=json`,
      query: `limit=5`,
    })),
  };
  return state;
});

each(dataPath('surveys[*]'), state => {
  const { url, query, type, formId, name, owner } = state.data;
  return get(`${url}${query}`, {}, state => {
    state.data.submissions = state.data.results.map((submission, i) => {
      return {
        i,
        // Here we append the tags defined above to the Kobo form submission data
        formId: formId,
        formType: type,
        formName: name,
        formOwner: owner,
        body: submission,
      };
    });
    const count = state.data.submissions.length;
    console.log(`Fetched ${count} submissions from ${formId} (${type}).`);
    // Once we fetch the data, we want to post each individual Kobo survey
    // back to the OpenFn inbox to run through the jobs =========================
    return each(dataPath('submissions[*]'), state => {
      console.log(`Posting ${state.data.i + 1} of ${count}...`);
      return post(state.configuration.openfnInboxUrl, {
        body: state => state.data,
      })(state);
    })(state);
    // =========================================================================
  })(state);
});
