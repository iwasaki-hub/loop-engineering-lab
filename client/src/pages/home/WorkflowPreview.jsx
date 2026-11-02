import { useState } from 'react'
import Icon from '../../components/ui/Icon'
import { workflowSteps } from './content'
import * as m from 'motion/react-m'
import { AnimatePresence, useReducedMotion } from 'motion/react'

export default function WorkflowPreview() {
  const [selected, setSelected] = useState('build')
  const step = workflowSteps.find((item) => item.id === selected)
  const reduced = useReducedMotion()
  const transition = { duration: reduced ? 0 : 0.16 }
  return (
    <div
      className="preview-scene"
      aria-label="AI開発ワークフローの説明用プレビュー"
    >
      <div className="scene-grid" aria-hidden="true" />
      <span className="scene-orbit orbit-one" aria-hidden="true" />
      <span className="scene-orbit orbit-two" aria-hidden="true" />
      <div className="preview-topline">
        <span>
          <span className="live-dot" /> A LITTLE IDEA. A NEW POSSIBILITY.
        </span>
        <span>WORKSPACE PREVIEW</span>
      </div>
      <div className="workspace">
        <div className="workspace-titlebar">
          <span className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <Icon name="loop" size={14} /> loop-engineering-lab
          </span>
          <span className="sample-label">説明用サンプル</span>
        </div>
        <div className="workspace-body">
          <div className="workspace-sidebar">
            <div className="workspace-project">
              <Icon name="code" size={15} /> Workspace
            </div>
            <div
              className="workflow-tabs"
              role="group"
              aria-label="開発工程を切り替える"
            >
              {workflowSteps.map((item) => (
                <m.button
                  whileTap={reduced ? undefined : { scale: 0.96 }}
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  aria-pressed={selected === item.id}
                  className={selected === item.id ? 'selected' : ''}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                  <span className="tab-number">{item.number}</span>
                </m.button>
              ))}
            </div>
            <div className="sidebar-bottom">
              <Icon name="loop" size={15} /> Human + AI
            </div>
          </div>
          <div className="workspace-conversation" aria-live="polite">
            <AnimatePresence initial={false} mode="wait">
              <m.div
                key={selected}
                className="conversation-content"
                initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : -4 }}
                transition={transition}
              >
                <p className="panel-caption">YOUR NEXT IDEA</p>
                <div className="user-prompt">{step.prompt}</div>
                <div className="agent-name">
                  <span className="agent-avatar">
                    <Icon name="loop" size={13} />
                  </span>{' '}
                  AI partner <span>•</span>
                </div>
                <p className="agent-answer">{step.answer}</p>
                <div className="task-done">
                  <Icon name="check" size={14} />
                  {step.note}
                </div>
                <div className="preview-input">
                  <span>次は、どんなことをつくろう？</span>
                  <span className="input-arrow" aria-hidden="true">
                    ↑
                  </span>
                </div>
              </m.div>
            </AnimatePresence>
          </div>
          <div className="workspace-code" aria-live="polite">
            <AnimatePresence initial={false} mode="wait">
              <m.div
                key={selected}
                className="preview-code-content"
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: reduced ? 1 : 0 }}
                transition={transition}
              >
                <div className="file-tab">
                  <Icon name="code" size={13} />
                  {step.file}
                  <span>×</span>
                </div>
                <div className="code-lines">
                  {step.lines.map((line, index) => (
                    <div
                      className={line ? 'code-line' : 'code-line blank-line'}
                      key={`${step.id}-${index}`}
                    >
                      <span className="line-number">{index + 1}</span>
                      <code>{line || ' '}</code>
                    </div>
                  ))}
                </div>
                <div className="code-footer">
                  <span>
                    <span className="live-dot" /> {step.label}
                  </span>
                  <span>UTF-8</span>
                </div>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="workspace-bottom">
          <span>
            <Icon name="code" size={12} /> main
          </span>
          <span>設計 → 実装 → 検証 → 改善</span>
          <span>
            <Icon name="check" size={12} /> Small steps, real progress.
          </span>
        </div>
      </div>
      <div className="scene-caption">
        <span>あなたのアイデアに、もうひとつの視点を。</span>
        <span>
          EXPLORE THE LOOP <Icon name="diagonal" size={14} />
        </span>
      </div>
    </div>
  )
}
