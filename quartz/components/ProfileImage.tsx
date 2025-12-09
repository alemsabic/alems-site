import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ProfileImage: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "profile-image", "desktop-only")}>
      <img src="/static/icon.png" alt="NE KONTAM Logo" />
    </div>
  )
}

ProfileImage.css = `
.profile-image {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  margin: 0 auto 1.5rem auto;
  position: relative;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  margin: 0;
}
`

export default (() => ProfileImage) satisfies QuartzComponentConstructor
