describe('using offsets with a div as a reference container', function() {
  require('./fixtures/bootstrap.js');
  beforeEach(h.clean);
  afterEach(h.clean);

  var test;
  var container;
  var calls;
  var size = 300;
  var position = 1000;
  var offset = 200;
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
      container: container,
      offset: offset
    }, cb);
  });

  describe('when we do not scroll down on body', function() {

    describe('when we scroll inside the container', function() {

      describe('to the element', function () {
        var scrollToTheElement = position - size;
        beforeEach(h.scroller(scrollToTheElement, scrollToTheElement, 'container'));
        beforeEach(h.wait(50));

        it('cb not called', function () {
          assert.strictEqual(calls.length, 0);
        });
      });
    });
  });

  describe('when we scroll down on body', function() {
    beforeEach(h.scroller(0, containerTop));

    describe('when we scroll inside the container', function() {

      describe('to the element', function() {
        var scrollToTheElement = position - size;
        beforeEach(h.scroller(scrollToTheElement, scrollToTheElement, 'container'));
        beforeEach(h.wait(50));

        it('cb was called', function() {
          assert.strictEqual(calls.length, 1);
        });
      });

      describe('before the element', function () {
        var scrollBefore = position - size - offset - 2;
        beforeEach(h.scroller(100, 100, 'container'));
        beforeEach(h.scroller(scrollBefore, scrollBefore, 'container'));

        it('cb not called', function() {
          assert.strictEqual(calls.length, 0);
        });
      });

      describe('in the offset range', function() {
        var scrollInTheOffset = position - size - offset;
        beforeEach(h.scroller(scrollInTheOffset, scrollInTheOffset, 'container'));
        beforeEach(h.wait(50));

        it('cb was called', function() {
          assert.strictEqual(calls.length, 1);
        });
      });

      describe('too far after the element', function() {
        var scrollFarAfter = 2 * position;
        beforeEach(h.scroller(scrollFarAfter, scrollFarAfter, 'container'));

        it('cb not called', function() {
          assert.strictEqual(calls.length, 0);
        });
      });
    });
  });

  function cb(result) {
    calls.push(result);
  }
});