// esbuild plugin to mark stripe as external
export default {
  name: 'mark-stripe-external',
  setup(build) {
    build.onResolve({ filter: /^stripe$/ }, args => {
      return { path: args.path, external: true }
    })
  }
}
