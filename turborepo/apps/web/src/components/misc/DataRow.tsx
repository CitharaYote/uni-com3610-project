const DataRow = ({
  title,
  content,
  className,
  link = false,
}: {
  title: string;
  content: string;
  className: string;
  link?: boolean;
}) => {
  return (
    <div
      className={`${className} flex flex-row items-center justify-between text-uos-gray gap-x-8`}
    >
      <p>{title}:</p>
      {link ? (
        <a
          href={content}
          target="_blank"
          rel="noreferrer"
          className="font-light text-right line-clamp-1 text-ellipsis text-uos-purple"
        >
          {content}
        </a>
      ) : (
        <p className="font-light text-right">{content}</p>
      )}
    </div>
  );
};

export default DataRow;
