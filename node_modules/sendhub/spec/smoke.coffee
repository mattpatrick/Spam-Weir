if process.env.SENDHUB_USERNAME? and process.env.SENDHUB_APIKEY? and process.env.SENDHUB_TEST_PHONE?
  sendhub = require '../src/sendhub'
  should = require 'should'

  describe 'Smoke Tests against SendHub', ->
    before ->
      sendhub.username(process.env.SENDHUB_USERNAME)
      sendhub.apiKey(process.env.SENDHUB_APIKEY)

    after ->
      sendhub.config = {}

    describe 'finds contact and send message', ->
      it 'returns success message', (done) ->
        sendhub.listContacts {number: process.env.SENDHUB_TEST_PHONE}, (err, contacts) ->
          should.not.exist(err)
          contacts.length.should.be.above(0)

          developer = contacts[0]
          sendhub.sendMessage {contact: developer, text: 'Testing from node package'}, (err, response) ->
            should.not.exist(err)
            response.acknowledgment.should.equal 'Message queued for sending.'
            done()
