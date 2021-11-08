let Errors: Record<string, Array<string>> = {
  Javascript: [
    'URIError',
    'EvalError',
    'TypeError',
    'RangeError',
    'SyntaxError',
    'InternalError',
    'AggregateError',
    'ReferenceError',
  ],
  'C#': [
    'AccessViolationException ',
    'AggregateException ',
    'AppDomainUnloadedException ',
    'ApplicationException ',
    'ArgumentException ',
    'ArgumentNullException ',
    'ArgumentOutOfRangeException ',
    'ArithmeticException ',
    'ArrayTypeMismatchException ',
    'BadImageFormatException ',
    'CannotUnloadAppDomainException ',
    'ContextMarshalException ',
    'DataMisalignedException ',
    'DivideByZeroException ',
    'DllNotFoundException ',
    'DuplicateWaitObjectException ',
    'EntryPointNotFoundException ',
    'ExecutionEngineException ',
    'FieldAccessException ',
    'FormatException ',
    'IndexOutOfRangeException ',
    'InsufficientMemoryException ',
    'InvalidCastException ',
    'InvalidOperationException ',
    'InvalidProgramException ',
    'InvalidTimeZoneException ',
    'MemberAccessException ',
    'MethodAccessException ',
    'MissingFieldException ',
    'MissingMemberException ',
    'MissingMethodException ',
    'MulticastNotSupportedException ',
    'NotCancelableException ',
    'NotFiniteNumberException ',
    'NotImplementedException ',
    'NotSupportedException ',
    'NullReferenceException ',
    'ObjectDisposedException ',
    'OperationCanceledException ',
    'OutOfMemoryException ',
    'OverflowException ',
    'PlatformNotSupportedException',
    'RankException ',
    'StackOverflowException ',
    'SystemException ',
    'TimeoutException ',
    'TimeZoneNotFoundException ',
    'TypeAccessException ',
    'TypeInitializationException ',
    'TypeLoadException ',
    'TypeUnloadedException ',
    'UnauthorizedAccessException ',
    'UriFormatException ',
  ],
  Python: [
    'AssertionError',
    'AttributeError',
    'EOFError',
    'FloatingPointError',
    'GeneratorExit',
    'ImportError',
    'IndexError',
    'KeyError',
    'KeyboardInterrupt',
    'MemoryError',
    'NameError',
    'NotImplementedError',
    'OSError',
    'OverflowError',
    'ReferenceError',
    'RuntimeError',
    'StopIteration',
    'SyntaxError',
    'IndentationError',
    'TabError',
    'SystemError',
    'SystemExit',
    'TypeError',
    'UnboundLocalError',
    'UnicodeError',
    'UnicodeEncodeError',
    'UnicodeDecodeError',
    'UnicodeTranslateError',
    'ValueError',
    'ZeroDivisionError',
  ],
  Ruby: [
    'ArgumentError',
    'UncaughtThrowError',
    'EncodingError',
    'CompatibilityError',
    'ConverterNotFoundError',
    'InvalidByteSequenceError',
    'UndefinedConversionError',
    'FiberError',
    'IOError',
    'EOFError',
    'IndexError',
    'KeyError',
    'StopIteration',
    'LocalJumpError',
    'NameError',
    'NoMethodError',
    'RangeError',
    'FloatDomainError',
    'RegexpError',
    'RuntimeError',
    'SystemCallError',
    'ThreadError',
    'TypeError',
    'ZeroDivisionError',
  ],
};

export { Errors };