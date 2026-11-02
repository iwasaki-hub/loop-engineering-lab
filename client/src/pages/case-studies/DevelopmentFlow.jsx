import Icon from '../../components/ui/Icon'
import { developmentLoop } from './content'

export default function DevelopmentFlow() {
  return (
    <div className="case-flow">
      <ol>
        {developmentLoop.map((step, index) => (
          <li key={step.label}>
            <a href={step.href}>
              <div className="flow-step-top">
                <span>0{index + 1}</span>
                <Icon name={step.icon} size={20} />
              </div>
              <strong>{step.label}</strong>
              <span className="flow-step-detail">{step.detail}</span>
            </a>
          </li>
        ))}
      </ol>
      <p>
        <Icon name="loop" size={15} />{' '}
        失敗したら、原因を確かめて修正する。気づきを設計に戻し、もう一度。
      </p>
    </div>
  )
}
