using Ninject;

namespace Considerate.Helpers {

    public static class Injection
    {
	    public static StandardKernel Kernel { get; } = new StandardKernel();
    }

}

