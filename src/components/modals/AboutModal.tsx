import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const AboutModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="About" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        This is an open source word guessing game -{' '}
        <a
          href="https://github.com/kevinshaffermorrison/shmordle"
          className="underline font-bold"
        >
          check out the code here
        </a>{' '}
        it was forked from the{' '}
        <a
          href="https://github.com/hannahcode/word-guessing-game"
          className="underline font-bold"
        >
          code created by hannah
        </a>
      </p>
    </BaseModal>
  )
}
