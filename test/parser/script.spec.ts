import { parse } from 'vue-eslint-parser'
import { extractProps, extractData, Prop, Data } from '../../src/parser/script'

describe('Script parser', () => {
  it('should extract props', () => {
    const code = `<script>
    export default {
      props: {
        foo: String,
        bar: {
          type: Number,
          default: 42
        }
      }
    }
    </script>`

    const program = parse(code, { sourceType: 'module' })
    const extracted = extractProps(program.body)
    const expected: Prop[] = [
      {
        name: 'foo',
        type: 'String',
        default: undefined
      },
      {
        name: 'bar',
        type: 'Number',
        default: 42
      }
    ]
    expect(extracted).toEqual(expected)
  })

  it('should extract props from array definition', () => {
    const code = `<script>
    export default { props: ['test'] }
    </script>`

    const program = parse(code, { sourceType: 'module' })
    const extracted = extractProps(program.body)
    const expected: Prop[] = [
      {
        name: 'test',
        type: 'any',
        default: undefined
      }
    ]
    expect(extracted).toEqual(expected)
  })

  it('should extract props from Vue.extend defintion', () => {
    const code = `<script>
    export default Vue.extend({ props: ['foo'] })
    </script>`

    const program = parse(code, { sourceType: 'module' })
    const extracted = extractProps(program.body)
    const expected: Prop[] = [
      {
        name: 'foo',
        type: 'any',
        default: undefined
      }
    ]
    expect(extracted).toEqual(expected)
  })

  it('should extract data', () => {
    const code = `<script>
    export default {
      data () {
        return { foo: 'test' }
      }
    }
    </script>`

    const program = parse(code, { sourceType: 'module' })
    const extracted = extractData(program.body)
    const expected: Data[] = [
      {
        name: 'foo',
        default: 'test'
      }
    ]
    expect(extracted).toEqual(expected)
  })

  it('should extract data from arrow function', () => {
    const code = `<script>
    export default {
      data: () => ({
        abc: 123,
        cde: true
      })
    }
    </script>`

    const program = parse(code, { sourceType: 'module' })
    const extracted = extractData(program.body)
    const expected: Data[] = [
      {
        name: 'abc',
        default: 123
      },
      {
        name: 'cde',
        default: true
      }
    ]
    expect(extracted).toEqual(expected)
  })
})
