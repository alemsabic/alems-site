import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ProfileImage: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "profile-image", "desktop-only")}>
      <img src="/static/kursnotizen-logo.png" alt="Profile" />
    </div>
  )
}

ProfileImage.css = `
.profile-image {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lightgray);
  margin: -80px auto 0.75rem auto;
  border: 3px solid var(--light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  margin: 0;
}
`

export default (() => ProfileImage) satisfies QuartzComponentConstructor
