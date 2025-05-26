export interface TableOfContentsItem {
  id: string
  text: string
  children?: TableOfContentsItem[]
}

interface TableOfContentsProps {
  toc: TableOfContentsItem[]
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ toc }) => {
  // const activeHash = useActiveHash(toc.map((item) => item.id))

  return (
    <nav className="toc">
      <ul>
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              // className={activeHash === item.id ? 'active' : ''}
            >
              {item.text}
            </a>
            {item.children && item.children.length > 0 && (
              <ul>
                {item.children.map((child: TableOfContentsItem) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      // className={activeHash === child.id ? 'active' : ''}
                    >
                      {child.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
