
import { useContext, useCallback } from 'react'
import UserContext from 'context/user'
import ContactsContext from 'context/contacts'

import fetchJsonp from 'fetch-jsonp'

const { gapi } = window

const useGoogleAPI = () => {
  const { updateUserProfile } = useContext(UserContext)
  const { updateContacts } = useContext(ContactsContext)

  const getContacts = useCallback(() => {
    try {
      const token = gapi.auth.getToken().access_token
      const endpoint = `https://www.googleapis.com/m8/feeds/contacts/default/thin?alt=json&access_token=${token}&max-results=500&v=3.0`
      fetchJsonp(endpoint)
        .then(response => response.json())
        .then(json => updateContacts((json.feed.entry || [])
          .filter(contact => contact.gd$email)
          .map(contact => ({
            id: contact.id.$t.split('/').pop(),
            email: contact.gd$email[0].address,
            name: contact.gd$name,
            title: contact.title.$t,
            photo: contact.link,
          }))))
    } catch (e) {
      // eslint-disable-next-line
      window.alert('Linbox require new oauth scopes, please logout and try again.')
    }
  }, [])

  const signIn = useCallback(() => gapi.auth2.getAuthInstance().signIn(), [])
  const signOut = useCallback(() => {
    gapi.auth2.getAuthInstance().signOut()
    updateUserProfile(null)
  }, [])

  const initUser = useCallback((isSignedIn) => {
    // When signin status changes, this function is called.
    // If the signin status is changed to signedIn, we make an API call.
    if (isSignedIn) {
      gapi.client.people.people.get({
        resourceName: 'people/me',
        personFields: 'names,locales,photos,emailAddresses',
      })
        .then(
          response => updateUserProfile(response.result),
          reason => console.log(`Error: ${reason.result.error.message}`), // eslint-disable-line
        )
    }
  }, [])

  const initClient = useCallback(() => gapi.load('client:auth2', () => {
    // Initialize the client with API key and People API, and initialize OAuth with an
    // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    if (gapi.auth2.getAuthInstance()) {
      initUser(gapi.auth2.getAuthInstance().isSignedIn.get())
      return null
    }
    return gapi.client.init({
      apiKey: 'AIzaSyAvRqMi5pnaGVCV14BlEfKGs9xePuhtZk0',
      discoveryDocs: [
        'https://people.googleapis.com/$discovery/rest?version=v1',
        'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
      ],
      clientId: '283173290792-09mip7ds9kjfo77qs1p4c3ea07pk2mot.apps.googleusercontent.com',
      scope: [
        'profile',
        'https://mail.google.com/',
        'https://www.google.com/m8/feeds',
      ].join(' '),
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(initUser)
      // Handle the initial sign-in state.
      initUser(gapi.auth2.getAuthInstance().isSignedIn.get())
      getContacts()
    })
  }), [])

  return {
    apiClient: gapi.client, signIn, signOut, initClient, getContacts,
  }
}

export default useGoogleAPI
