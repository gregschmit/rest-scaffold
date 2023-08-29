<script>
  export let size
</script>

<div class="rs-loader" style={`width: ${size || "1.2em"}`}>
  <svg class="rs-circular" viewBox="25 25 50 50">
    <circle class="rs-path" cx="50" cy="50" r="20" fill="none" />
  </svg>
</div>

<style>
  .rs-loader {
    position: relative;
    margin: 0 auto;
  }

  .rs-loader:before {
    content: "";
    display: block;
    padding-top: 100%;
  }

  .rs-loader .rs-circular {
    animation: rotate 2s linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .rs-loader .rs-circular .rs-path {
    stroke: var(--rs-primary);
    animation: dash 1.5s ease-in-out infinite;
    stroke-linecap: round;
    stroke-width: 4;
    stroke-miterlimit: 10;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 140, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 140, 200;
      stroke-dashoffset: -124px;
    }
  }
</style>
