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
  margin: -75px auto 0.75rem auto;
  position: relative;
}

.profile-image::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom,
    transparent 0%,
    transparent 70%,
    var(--light) 100%
  );
  pointer-events: none;
  z-index: 1;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  margin: 0;
  mask-image: linear-gradient(to bottom,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 75%,
    rgba(0,0,0,0) 100%
  );
  -webkit-mask-image: linear-gradient(to bottom,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 75%,
    rgba(0,0,0,0) 100%
  );
}
`

export default (() => ProfileImage) satisfies QuartzComponentConstructor
