export const getScrollbarSize = () => {
  const { body } = document;
  const scrollDiv = document.createElement('div');

  // Append element with defined styling
  scrollDiv.setAttribute(
    'style',
    'width: 1337px; height: 1337px; position: absolute; left: -9999px; overflow: scroll;'
  );
  body.appendChild(scrollDiv);

  // Collect width & height of scrollbar
  const calculateValue = (type) =>
    scrollDiv[`offset${type}`] - scrollDiv[`client${type}`];
  const scrollbarWidth = calculateValue('Width');
  const scrollbarHeight = calculateValue('Height');

  // Remove element
  body.removeChild(scrollDiv);

  return {
    width: scrollbarWidth,
    height: scrollbarHeight
  };
};
