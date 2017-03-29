describe('Distinct random number generation', function () {
    var _ = require('lodash'),
        testrun;

    before(function (done) {
        this.run({
            collection: {
                item: [{
                    request: 'https://postman-echo.com/get?a={{$randomInt}}',
                }, {
                    request: 'https://postman-echo.com/get?a={{$randomInt}}',
                }]
            }
        }, function (err, results) {
            testrun = results;
            done(err);
        });
    });

    it('must have sent two requests successfully', function () {
        expect(testrun).be.ok();
        expect(testrun.request.calledTwice).be.ok();
        expect(testrun.request.getCall(0).args[0]).to.be(null);
        expect(testrun.request.getCall(1).args[0]).to.be(null);
    });

    it('must have substituted the {{$randomInt}} variable in both requests', function () {
        var firstUrl = _.get(testrun.request.getCall(0), 'args[3].url'),
            secondUrl = _.get(testrun.request.getCall(1), 'args[3].url'),
            firstParam,
            secondParam;

        expect(firstUrl).to.be.ok();
        expect(secondUrl).to.be.ok();

        firstParam = firstUrl.query.idx(0);
        secondParam = secondUrl.query.idx(0);

        // Ensure that both params are integers
        expect(_.isInteger(_.parseInt(firstParam.value, 10))).to.eql(true);
        expect(_.isInteger(_.parseInt(secondParam.value, 10))).to.eql(true);
    });

    it('must have generated different random integers for both requests', function () {
        var firstUrl = _.get(testrun.request.getCall(0), 'args[3].url'),
            secondUrl = _.get(testrun.request.getCall(1), 'args[3].url'),
            firstParam,
            secondParam;

        expect(firstUrl).to.be.ok();
        expect(secondUrl).to.be.ok();

        firstParam = firstUrl.query.idx(0);
        secondParam = secondUrl.query.idx(0);

        // Ensure that both params are different
        expect(firstParam.value).to.not.equal(secondParam.value);
    });

    it('must have completed the run', function () {
        expect(testrun).be.ok();
        expect(testrun.done.calledOnce).be.ok();
        expect(testrun.done.getCall(0).args[0]).to.be(null);
        expect(testrun.start.calledOnce).be.ok();
    });
});
