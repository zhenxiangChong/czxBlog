---
url: /czxBlog/memorandum/grep/index.md
---
## 参数

|                 |                                         | 说明                                                                                                 |
| --------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `-a`            | `--text`                                | 不要忽略二进制数据。                                                                                 |
| `-A <显示行数>` | `--after-context=<显示行数>`            | 除了显示符合范本样式的那一行之外，并显示该行之后的内容。                                             |
| `-b`            | `--byte-offset`                         | 在显示符合范本样式的那一行之外，并显示该行之前的内容。                                               |
| `-B <显示行数>` | `--before-context=<显示行数>`           | 除了显示符合样式的那一行之外，并显示该行之前的内容。                                                 |
| `-c`            | `--count`                               | 计算符合范本样式的列数。                                                                             |
| `-C <显示行数>` | `--context=<显示行数>` 或 `-<显示行数>` | 除了显示符合范本样式的那一列之外，并显示该列之前后的内容。                                           |
| `-d<进行动作>`  | `--directories=<动作>`                  | 当指定要查找的是目录而非文件时，必须使用这项参数，否则grep命令将回报信息并停止动作。                 |
| `-e <范本样式>` | `--regexp=<范本样式>`                   | 指定字符串作为查找文件内容的范本样式。                                                               |
| `-E`            | `--extended-regexp`                     | 将范本样式为延伸的普通表示法来使用，意味着使用能使用扩展正则表达式。                                 |
| `-f <范本文件>` | `--file=<规则文件>`                     | 指定范本文件，其内容有一个或多个范本样式，让grep查找符合范本条件的文件内容，格式为每一列的范本样式。 |
| `-F`            | `--fixed-regexp`                        | 将范本样式视为固定字符串的列表。                                                                     |
| `-G`            | `--basic-regexp`                        | 将范本样式视为普通的表示法来使用。                                                                   |
| `-h`            | `--no-filename`                         | 在显示符合范本样式的那一列之前，不标示该列所属的文件名称。                                           |
| `-H`            | `--with-filename`                       | 在显示符合范本样式的那一列之前，标示该列的文件名称。                                                 |
| `-i`            | `--ignore-case`                         | 忽略字符大小写的差别。                                                                               |
| `-l`            | `--file-with-matches`                   | 列出文件内容符合指定的范本样式的文件名称。                                                           |
| `-L`            | `--files-without-match`                 | 列出文件内容不符合指定的范本样式的文件名称。                                                         |
| `-n`            | `--line-number`                         | 在显示符合范本样式的那一列之前，标示出该列的编号。                                                   |
| `-P`            | `--perl-regexp`                         | PATTERN 是一个 Perl 正则表达式                                                                       |
| `-q`            | `--quiet或--silent`                     | 不显示任何信息。                                                                                     |
| `-R`/`-r`       | `--recursive`                           | 此参数的效果和指定“-d recurse”参数相同。                                                             |
| `-s`            | `--no-messages`                         | 不显示错误信息。                                                                                     |
| `-v`            | `--revert-match`                        | 反转查找。                                                                                           |
| `-V`            | `--version`                             | 显示版本信息。                                                                                       |
| `-w`            | `--word-regexp`                         | 只显示全字符合的列。                                                                                 |
| `-x`            | `--line-regexp`                         | 只显示全列符合的列。                                                                                 |
| `-y`            |                                         | 此参数效果跟“-i”相同。                                                                               |
| `-o`            |                                         | 只输出文件中匹配到的部分。                                                                           |
| `-m <num>`      | `--max-count=<num>`                     | 找到num行结果后停止查找，用来限制匹配行数                                                            |

## 规则表达式

```sh :no-line-numbers
^      # 锚定行的开始 如：'^grep'匹配所有以grep开头的行。
$      # 锚定行的结束 如：'grep$' 匹配所有以grep结尾的行。
.      # 匹配一个非换行符的字符 如：'gr.p'匹配gr后接一个任意字符，然后是p。
*      # 匹配零个或多个先前字符 如：'*grep'匹配所有一个或多个空格后紧跟grep的行。
.*     # 一起用代表任意字符。
[]     # 匹配一个指定范围内的字符，如'[Gg]rep'匹配Grep和grep。
[^]    # 匹配一个不在指定范围内的字符，如：'[^A-Z]rep' 匹配不包含 A-Z 中的字母开头，紧跟 rep 的行
(..)   # 标记匹配字符，如'(love)'，love被标记为1。
<      # 锚定单词的开始，如:'<grep'匹配包含以grep开头的单词的行。
>      # 锚定单词的结束，如'grep>'匹配包含以grep结尾的单词的行。
x{m}   # 重复字符x，m次，如：'0{5}'匹配包含5个o的行。
x{m,}  # 重复字符x,至少m次，如：'o{5,}'匹配至少有5个o的行。
x{m,n} # 重复字符x，至少m次，不多于n次，如：'o{5,10}'匹配5--10个o的行。
\w     # 匹配文字和数字字符，也就是[A-Za-z0-9]，如：'G\w*p'匹配以G后跟零个或多个文字或数字字符，然后是p。
\W     # \w的反置形式，匹配一个或多个非单词字符，如点号句号等。
\b     # 单词锁定符，如: '\bgrep\b'只匹配grep。
```
