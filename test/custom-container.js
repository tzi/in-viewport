describe('using a div as a reference container', function() {
  require('./fixtures/bootstrap.js');
  beforeEach(h.clean);
  afterEach(h.clean);

  var test;
  var container;
  var calls;
  var size = 300;
  var position = 1000;
  var containerTop = 3000;

  beforeEach(function() {
    calls = [];
    test = h.createTest({
      style: {
        left: position + 'px',
        top: position + 'px'
      }
    });

    container = h.createTest({
      attributes: {
        id: 'container'
      },
      style: {
        top: containerTop + 'px',
        width: size + 'px',
        height: size + 'px',
        overflow: 'scroll'
      }
    });

    container.innerHTML = '<div class="scrollTrigger"></div>';

    h.insertTest(test, container);
    h.insertTest(container);

    inViewport(test, {
      container: container
    }, cb);
  });

  describe('when we do not scroll down on body', function() {

    describe('when we scroll inside the container to the element', function () {
      beforeEach(h.scroller(position, position, 'container'));
      beforeEach(h.wait(50));

      it('cb not called', function() {
        assert.strictEqual(calls.length, 0);
      });
    });
  });

  describe('when we scroll down on body', function() {
    beforeEach(h.scroller(0, containerTop));

    describe('when we scroll inside the container', function() {

      describe('to the element', function() {
        beforeEach(h.scroller(position, position, 'container'));
        beforeEach(h.wait(50));

        it('cb was called', function() {
          assert.strictEqual(calls.length, 1);
        });
      });

      describe('before the div', function () {
        beforeEach(h.scroller(100, 100, 'container'));

        it('cb not called', function() {
          assert.strictEqual(calls.length, 0);
        });
      });

      describe('too far after the div', function() {
        beforeEach(h.scroller(2*position, 2*position, 'container'));

        it('cb not called', function() {
          assert.strictEqual(calls.length, 0);
        });
      });

      describe('when we scroll down, up, like crazy', function() {
        beforeEach(h.scroller(0, 200, 'container'));
        beforeEach(h.scroller(0, position, 'container'));
        beforeEach(h.scroller(0, 20000, 'container'));
        beforeEach(h.scroller(position, position, 'container'));

        it('cb was called once', function() {
          assert.strictEqual(calls.length, 1);
        });
      });
    });
  });

  function cb(result) {
    calls.push(result);
  }
});