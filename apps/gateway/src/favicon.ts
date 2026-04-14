// Cometa logo SVG with white background for favicon
export const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="32" height="32">
  <rect width="200" height="200" rx="40" fill="#ffffff"/>
  <defs>
    <clipPath id="lc"><rect width="200" height="200" x="0" y="0"/></clipPath>
    <g id="lg">
      <g transform="matrix(0.997,0,0,1,100.147,100)" opacity="1">
        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
          <path fill="rgb(255,0,0)" fill-opacity="1" d="M51.995,-68.599 C51.995,-31.97 22.612,-2.586 -14.017,-2.586 C-14.017,-2.586 -51.854,-2.586 -51.854,-2.586 C-53.188,-2.586 -54.269,-1.505 -54.269,-0.171 C-54.269,1.163 -53.188,2.244 -51.854,2.244 C-51.854,2.244 -14.017,2.244 -14.017,2.244 C22.612,2.244 51.995,31.628 51.995,68.257 C51.995,68.257 52.995,68.257 52.995,68.257 C52.995,68.257 52.995,-68.599 52.995,-68.599 C52.995,-68.599 51.995,-68.599 51.995,-68.599z"/>
        </g>
      </g>
    </g>
    <filter id="lf" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
      <feComponentTransfer in="SourceGraphic"><feFuncA type="table" tableValues="1.0 0.0"/></feComponentTransfer>
    </filter>
    <mask id="lm" maskType="alpha">
      <g filter="url(#lf)">
        <rect width="200" height="200" x="0" y="0" fill="#ffffff" opacity="0"/>
        <use xlink:href="#lg"/>
      </g>
    </mask>
  </defs>
  <g clip-path="url(#lc)">
    <g mask="url(#lm)">
      <g transform="matrix(1,0,0,1,100,100)" opacity="1">
        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
          <path fill="rgb(0,0,0)" fill-opacity="1" d="M-51.925,-68.428 L51.925,-68.428 L51.925,68.428 L-51.925,68.428z"/>
        </g>
      </g>
    </g>
  </g>
</svg>`;
